# Headstart

Library to assist in integrating PostGraphile with Tanstack Start and URQL.

This library is made up of:

- An URQL Exchange that queries grafast for SSR pages (so we don't make an unecessary HTTP request)
- A Grafserv adapter to work with Tanstack Start, including Web Socket support.
- SSR Exchange to be used on the server and client for hydration

## Installation

1. Initialize Tanstack Start as per: https://tanstack.com/router/latest/docs/framework/react/start/getting-started

2. Install Postgraphile as a library as per: https://tanstack.com/router/latest/docs/framework/react/start/getting-started
   Specifically, the `graphile.config.ts` and `pgl.ts`. If you need WebSocket support, make sure to add a plugin in `graphile.config.ts` as per: https://postgraphile.org/postgraphile/next/subscriptions

3. Enable WebSockets in `app.config.ts` if you need it:

```
// app.config.ts
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
	server: {
		experimental: {
			websocket: true,
		},
	},
});
```

4. Make sure to add the `/api` endpoint to the grafserv configuration so that Ruru GraphQL client works correctly:

```
// graphile.config.ts
const preset: GraphileConfig.Preset = {
    ...
	grafserv: {
        ...
		graphqlPath: "/api",
		eventStreamPath: "/api",
	},
    ...
};
```

5. Add the api.ts file so that it calls our GraphQL handler. This will receive all GraphQL requests at the /api endpoint.

```
// app/api.ts
import { createGraphQLRouteHandler } from "@carvajalconsultants/headstart";
import { pgl } from "../pgl";

export default createGraphQLRouteHandler(pgl);
```

6. Now we need to configure URQL for client and server rendering, first we start with the server. Create this provider:

```
// app/graphql/serverProvider.tsx
import { Client, Provider } from "urql";
import { grafastExchange, ssr } from "@carvajalconsultants/headstart";
import { pgl } from "../../pgl";

/**
 * Configure URQL for server side querying with Grafast.
 *
 * This removes the need to make an HTTP request to ourselves and simply executes the GraphQL query.
 */
export const client = new Client({
	url: ".",
	exchanges: [ssr, grafastExchange(pgl)],
});
```

7. Create the server side router which uses Grafast to execute queries:

```
// app/serverRouter.tsx
import { ssr } from "@carvajalconsultants/headstart";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { Provider } from "urql";
import { client } from "./graphql/serverProvider";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			client,
		},

		// Send data to client so URQL can be hydrated.
		dehydrate: () => ({ initialData: ssr.extractData() }),

        // Wrap our entire route with the URQL provider so we can execute queries and mutations.
		Wrap: ({ children }) => <Provider value={client}>{children}</Provider>,
	});

	return router;
}
```

8. Modify the TSR server-side rendering function to use this new router:

```
// app/ssr.tsx
/// <reference types="vinxi/types/server" />
import { getRouterManifest } from "@tanstack/start/router-manifest";
import {
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/start/server";

import { createRouter } from "./serverRouter";

export default createStartHandler({
	createRouter,
	getRouterManifest,
})(defaultStreamHandler);
```

9. Add the client side router which uses the fetch exchange to execute queries, mutations, etc.:

```
// app/clientRouter.tsx
import { ssr } from "@carvajalconsultants/headstart";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { Provider } from "urql";
import { client } from "./graphql/clientProvider";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			client,
		},
		hydrate: (dehydrated) => {
			// Hydrate URQL with data passed by TSR, this is generated by dehydrate function in server router.
			ssr.restoreData(dehydrated.initialData);
		},

        // Wrap our entire route with the URQL provider so we can execute queries and mutations.
		Wrap: ({ children }) => <Provider value={client}>{children}</Provider>,
	});

	return router;
}
```

10. Tell TSR to use our client side router:

```
// app/client.tsx
/// <reference types="vinxi/types/client" />
import { StartClient } from "@tanstack/start";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./clientRouter";

const router = createRouter();

// biome-ignore lint: Safe enough to assume root element will be there
hydrateRoot(document.getElementById("root")!, <StartClient router={router} />);
```

11. Last but not least, you're ready to start using URQL on your components and pages. First we create the route using the loader option so we can pre-load data:

```
export const Route = createFileRoute("/")({
	...
	validateSearch: zodSearchValidator(paramSchema),

	loaderDeps: ({ search: { page } }) => ({ page }),
	loader: ({ context, deps: { page } }) =>
		context.client.query(
			gql`...`
			{ first: CHARITIES_PER_PAGE, offset: (page - 1) * CHARITIES_PER_PAGE },
		),
	...
});
```

12. Now in your component, you can query with URQL as you normally would:

```
const Home = () => {
	const { page } = Route.useSearch();

	const [{ data, error }] = useQuery({
		query: gql`...`,
		variables: {
			first: CHARITIES_PER_PAGE,
			offset: (page - 1) * CHARITIES_PER_PAGE,
		},
	});

	// Subscribe to any data changes on the server
	useSubscription({ query: allCharitiesSubscription });
}
```

## Deployment

1. Run `bun run build`
2. `cd .output/server`
3. `rm -rf node_modules`
4. `bun install`
5. `bun run index.mjs`
