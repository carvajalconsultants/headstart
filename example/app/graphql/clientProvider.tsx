import { cacheExchange } from "@urql/exchange-graphcache";
import { Client, fetchExchange, ssrExchange, subscriptionExchange } from "urql";

import { createClient as createWSClient } from "graphql-ws";
import type { FC, ReactElement } from "react";
import { Provider } from "urql";

import { ssr } from "./ssrExchange";

const wsClient = createWSClient({
	url: "ws://localhost:3000/api",
});

export const client = new Client({
	url: "http://localhost:3000/api",
	// requestPolicy: 'cache-and-network',
	// fetchSubscriptions: true,
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

export const GraphProvider: FC<{ children: ReactElement }> = ({ children }) => (
	<Provider value={client}>{children}</Provider>
);
