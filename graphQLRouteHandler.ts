import { CloseCode, makeServer } from "graphql-ws";
import { makeGraphQLWSConfig } from "postgraphile/grafserv";
import { grafserv } from "postgraphile/grafserv/h3/v1";
import { defineEventHandler, getHeader, toWebRequest } from "vinxi/http";

import type { StartAPIHandlerCallback } from "@tanstack/start/api";
import { type Hooks, type Message, type Peer } from "crossws";
import type { GrafservBase } from "grafserv";
import type { H3Grafserv } from "grafserv/h3/v1";
import type { PostGraphileInstance } from "postgraphile";

/**
 * This is an H3 handler that does all of the GraphQL request processing in TSR (including Subscriptions).
 *
 * Code is basically from: https://discord.com/channels/489127045289476126/498852330754801666/1260251871877271704
 */

type PeerState = {
	onMessage: (data: string) => Promise<void>;
	closed: (code: number, reason: string) => void;
};

/**
 * Builds the crossws WebSocket hooks for graphql-ws.
 *
 * Uses the platform-agnostic crossws peer API (peer.send, peer.close, peer.id)
 * instead of the Node.js ws-library EventEmitter API (socket.on, socket.send(cb)).
 * This makes subscriptions work on both Node.js and Bun runtimes.
 */
function makeWsHandler(instance: H3Grafserv): Partial<Hooks> {
	const graphqlWsServer = makeServer(makeGraphQLWSConfig(instance));
	const peerStates = new Map<string, PeerState>();

	return {
		open(peer: Peer) {
			// graphql-ws registers the message callback synchronously inside opened(),
			// so messageCallback is guaranteed to be set before opened() returns.
			let messageCallback: ((data: string) => Promise<void>) | null = null;

			const closed = graphqlWsServer.opened(
				{
					// crossws polyfills peer.websocket.protocol from the Sec-WebSocket-Protocol header
					protocol: peer.websocket.protocol ?? "",

					// peer.send() works on both Node.js and Bun — no callback, no hanging Promise
					send: async (data) => {
						peer.send(data);
					},

					close: (code, reason) => {
						peer.close(code, reason);
					},

					onMessage: (cb) => {
						messageCallback = cb;
					},
				},
				{},
			);

			if (messageCallback) {
				peerStates.set(peer.id, { onMessage: messageCallback, closed });
			}
		},

		// crossws calls this hook when a message arrives — works on both Node.js and Bun
		async message(peer: Peer, message: Message) {
			const state = peerStates.get(peer.id);
			if (!state) return;

			try {
				await state.onMessage(message.text());
			} catch (err) {
				try {
					peer.close(CloseCode.InternalServerError, (err as Error).message);
				} catch {
					// noop
				}
			}
		},

		// Cleans up per-peer state when the connection closes
		close(peer: Peer, details: { code?: number; reason?: string }) {
			const state = peerStates.get(peer.id);
			if (!state) return;

			state.closed(details.code ?? 1000, details.reason ?? "");
			peerStates.delete(peer.id);
		},
	};
}

// Make sure this is not instantiated more than once
let serv: GrafservBase;

/**
 * Actual H3 endpoint handler that intercepts requests to /api/graphql and processes with Postgraphile.
 *
 * @param pgl Postgraphile instance that has the connection to the database.
 * @param cb Start API handler callback, usually defaultAPIFileRouteHandler from Start.
 */
export const createStartAPIHandler = (
	pgl: PostGraphileInstance,
	cb: StartAPIHandlerCallback,
) => {
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
