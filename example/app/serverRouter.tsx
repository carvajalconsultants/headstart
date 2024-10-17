import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { Provider } from "urql";
import { client } from "./graphql/serverProvider";
import { ssr } from "../headstart/ssrExchange";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			client,
		},

		// Send data to client so URQL can be hydrated.
		dehydrate: () => ({ initialData: ssr.extractData() }),

		Wrap: ({ children }) => <Provider value={client}>{children}</Provider>,
	});

	return router;
}
