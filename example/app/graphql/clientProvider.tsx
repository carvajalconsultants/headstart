import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient as createWSClient } from "graphql-ws";
import { Client, fetchExchange, ssrExchange, subscriptionExchange } from "urql";
import { ssr } from "../../headstart/ssrExchange";

const wsClient = createWSClient({
	url: "ws://localhost:3000/api",
});

export const client = new Client({
	url: "http://localhost:3000/api",
	exchanges: [
		cacheExchange(),
		ssr,
		fetchExchange,
		subscriptionExchange({
			forwardSubscription(request) {
				const input = { ...request, query: request.query || "" };
				return {
					subscribe(sink) {
						const unsubscribe = wsClient.subscribe(input, sink);
						return { unsubscribe };
					},
				};
			},
		}),
	],
});
