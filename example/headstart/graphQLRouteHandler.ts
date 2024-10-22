import { CloseCode, makeServer } from "graphql-ws";
import { makeGraphQLWSConfig } from "postgraphile/grafserv";
import { grafserv } from "postgraphile/grafserv/h3/v1";
import { defineEventHandler, getHeader, getRequestURL, toWebRequest } from "vinxi/http";

import type { IncomingMessage } from "node:http";
import type { Hooks, Peer } from "crossws";
import type { H3Grafserv } from "grafserv/h3/v1";
import type { PostGraphileInstance } from "postgraphile";
import type { WebSocket } from "ws";
import type { StartAPIHandlerCallback } from "@tanstack/start/api";

/**
 * This is an H3 handler that does all of the GraphQL request processing in TSR (including Subscriptions).
 *
 * Code is basically from: https://discord.com/channels/489127045289476126/498852330754801666/1260251871877271704
 *
 * We do however want to be able to use other API routes in TSR, so this will need to be rewritten so we can have a /api/graphql endpoint.
 */

/**
 * TODO: make it generic when crossws implements the WS API (Peer.close, Peer.protocol)
 * instead of accessing the socket directly through context (server agnostic)
 * https://github.com/unjs/crossws/issues/23
 * https://github.com/unjs/crossws/issues/16
 */
function makeWsHandler(instance: H3Grafserv): Partial<Hooks> {
	const graphqlWsServer = makeServer(makeGraphQLWSConfig(instance));
	const open = (
		peer: Peer<{ node: { ws: WebSocket; req: IncomingMessage } }>,
	) => {
		// TODO Getting the socket like this causes problems deploying to bun. We really need a better websocket implementation with crossws
		const { ws: socket } = peer.ctx.node;

		// a new socket opened, let graphql-ws take over
		const closed = graphqlWsServer.opened(
			{
				protocol: socket.protocol, // will be validated
				send: (data) =>
					new Promise((resolve, reject) => {
						socket.send(data, (err: Error) => (err ? reject(err) : resolve()));
					}),
				close: (code, reason) => {
					socket.close(code, reason);
				},
				onMessage: (cb) =>
					socket.addEventListener("message", async (event) => {
						try {
							await cb(event.data.toString());
						} catch (err) {
							try {
								socket.close(CloseCode.InternalServerError, err.message);
							} catch {
								// noop
							}
						}
					}),
			},
			// pass values to the `extra` field in the context
			//{ peer, socket, request },
			{},
		);
		socket.addEventListener("close", (e) => closed(e.code, e.reason), {
			once: true,
		});
	};

	return { open };
}

// Make sure this is not instantiated more than once
let serv;

/**
 * Actual H3 endpoint handler that intercepts requests to /api/graphql and processes with Postgraphile.
 * 
 * @param pgl Postgraphile instance that has the connection to the database.
 * @param cb Start API handler callback, usually defaultAPIFileRouteHandler from Start.
 */
export const createStartAPIHandler = (pgl: PostGraphileInstance, cb: StartAPIHandlerCallback) => {
	if (!serv) {
		// Initialize Grafserv which is the one that actually processes the GraphQL requests.
		serv = pgl.createServ(grafserv);
	}

	return defineEventHandler({
		handler: async (event) => {
			const request = toWebRequest(event);

			// Sad interception until we can get the socket instance in the Tanstack Start API
			if (request.url.indexOf("/api/graphql") > -1) {
				const acceptHeader = getHeader(event, "accept");

				if (acceptHeader === "text/event-stream") {
					// SSE events are handled here
					return serv.handleEventStreamEvent(event);
				}

				// Process query and mutation GraphQL requests here
				return serv.handleGraphQLEvent(event);
			}

			return await cb({ request });
		},

		// Initialize the handler that manages WebSocket subscriptions
		websocket: makeWsHandler(serv),
	});
};
