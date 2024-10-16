import type { IncomingMessage } from "node:http";
import type { Hooks, Peer } from "crossws";
import type { H3Grafserv } from "grafserv/h3/v1";
import { CloseCode, makeServer } from "graphql-ws";
import { makeGraphQLWSConfig } from "postgraphile/grafserv";
import { grafserv } from "postgraphile/grafserv/h3/v1";
import { defineWebSocket, eventHandler, getHeader } from "vinxi/http";
import type { WebSocket } from "ws";

import type { PostGraphileInstance } from "postgraphile";

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
		const { ws: socket, req: request } = peer.ctx.node;

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
						console.log(event.data.toString());
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
			{ peer, socket, request },
		);
		socket.addEventListener("close", (e) => closed(e.code, e.reason), {
			once: true,
		});
	};
	return { open };
}

export const createGraphQLRouteHandler = (pgl: PostGraphileInstance) => {
	const serv = pgl.createServ(grafserv);

	return eventHandler({
		handler: async (event) => {
			const acceptHeader = getHeader(event, "accept");

			if (acceptHeader === "text/event-stream") {
				// SSE events are handled here
				return serv.handleEventStreamEvent(event);
			}

			return serv.handleGraphQLEvent(event);
		},

		websocket: makeWsHandler(serv),
	});
};
