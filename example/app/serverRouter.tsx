// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { GraphProvider, client } from "./graphql/serverProvider";
import { ssr } from "./graphql/ssrExchange";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			client,
		},
		// Send data to client so URQL can be hydrated.
		dehydrate: () => ({ initialData: ssr.extractData() }),
		Wrap: ({ children }) => <GraphProvider>{children}</GraphProvider>,
	});

	return router;
}
