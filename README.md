# Headstart

Library to assist in integrating PostGraphile with Tanstack Start and URQL.

This library is made up of:

- An URQL Exchange that queries grafast for SSR pages (so we don't make an unecessary HTTP request)
- A Grafserv adapter to work with Tanstack Start, including Web Socket support.
- SSR Exchange to be used on the server and client for hydration

## Installation

1. Initialize Tanstack Start as per: https://tanstack.com/router/latest/docs/framework/react/start/getting-started

2. Install Postgraphile as a library as per: https://postgraphile.org/postgraphile/next/quick-start-guide#install-postgraphile (ensure to use the Typescript files).
   Specifically, the `graphile.config.ts` and `pgl.ts`. If you need WebSocket support, make sure to add a plugin in `graphile.config.ts` as per: https://postgraphile.org/postgraphile/next/subscriptions

3. Install Headtart & URQL:
```bash
yarn add @carvajalconsultants/headstart urql @urql/exchange-graphcache @urql/exchange-auth
```

4. Enable WebSockets in `app.config.ts` if you need it:

```typescript
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
	server: {
		experimental: {
			websocket: true,
		},
	},
});
```

5. Make sure to add the `/api` endpoint to the grafserv configuration so that Ruru GraphQL client works correctly:

```typescript
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

6. Add the api.ts file so that it calls our GraphQL handler. This will receive all GraphQL requests at the /api endpoint.

```typescript
// app/api.ts
import { defaultAPIFileRouteHandler } from "@tanstack/react-start/api";
import { createStartAPIHandler } from "@carvajalconsultants/headstart/server";
import { pgl } from "../pgl";

export default createStartAPIHandler(pgl, defaultAPIFileRouteHandler);
```

7. Now we need to configure URQL for client and server rendering, first we start with the server. Create this provider:

```typescript
// app/graphql/serverProvider.tsx
import { Client } from "urql";
import { grafastExchange } from "@carvajalconsultants/headstart/server";
import { ssr } from "@carvajalconsultants/headstart/client";
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

8. Now the client side for URQL:

```typescript
// app/graphql/clientProvider.tsx
import { ssr } from "@carvajalconsultants/headstart/client";
import { authExchange } from "@urql/exchange-auth";
import { cacheExchange } from "@urql/exchange-graphcache";
//import { relayPagination } from "@urql/exchange-graphcache/extras";
import { Client, fetchExchange } from "urql";

/**
 * Creates an authentication exchange for handling secure GraphQL operations.
 * This exchange ensures that all GraphQL requests are properly authenticated
 * and handles authentication failures gracefully.
 *
 * @returns {Object} Authentication configuration object
 * @returns {Function} .addAuthToOperation - Prepares operations with auth context
 * @returns {Function} .didAuthError - Detects authentication failures after server request
 * @returns {Function} .refreshAuth - Handles auth token refresh
 */
const auth = authExchange(async () => {
  //TODO Implement authentication checking for the client s ide
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log("IMPLEMENT CLIENT AUTH CHECK");
      resolve();
    }, 2000);
  });

  return {
    /**
     * Processes each GraphQL operation to include authentication context.
     * Currently configured as a pass-through as tokens are in cookies.
     *
     * @param {Operation} operation - The GraphQL operation to authenticate
     * @returns {Operation} The operation with authentication context
     */
    addAuthToOperation: (operation) => operation,

    /**
     * Identifies when an operation has failed due to authentication issues.
     * Used to trigger authentication refresh flows when needed.
     *
     * @param {Error} error - The GraphQL error response
     * @returns {boolean} True if the error was caused by authentication failure
     */
    didAuthError: (error) => error.graphQLErrors.some((e) => e.extensions?.code === "FORBIDDEN"),

    /**
     * Handles refreshing authentication when it becomes invalid.
     * Currently implemented as a no-op as token refresh is handled by getSession().
     */
    refreshAuth: async () => {
      /* No-op, this is done in getSession() */
    },
  };
});

/**
 * Configured GraphQL client for the application.
 * Provides a centralized way to make authenticated GraphQL requests with
 * proper caching and server-side rendering support.
 */
export const client = new Client({
  url: "http://localhost:3000/api/graphql",
  exchanges: [
    cacheExchange({
      resolvers: {
        Query: {
          // Implements relay-style pagination for fills pending match
          //queryName: relayPagination(),
        },
      },
    }),
    auth,
    ssr,
    fetchExchange,
  ],
});
```

9. Create the server side router which uses Grafast to execute queries:

```typescript
// app/serverRouter.tsx
import { ssr } from "@carvajalconsultants/headstart/client";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { Provider } from "urql";
import { client } from "./graphql/serverProvider";
import { routeTree } from "./routeTree.gen";

import type { ReactNode } from "react";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			client,
		},

		// Send data to client so URQL can be hydrated.
		dehydrate: () => ({ initialData: ssr.extractData() }),

		// Wrap our entire route with the URQL provider so we can execute queries and mutations.
		Wrap: ({ children }: { children: ReactNode }) => <Provider value={client}>{children}</Provider>,
	});

	return router;
}
```

10. Modify the TSR server-side rendering function to use this new router:

```typescript
/* eslint-disable */
// app/ssr.tsx
/// <reference types="vinxi/types/server" />
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
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

11. Add the client side router which uses the fetch exchange to execute queries, mutations, etc.:

```typescript
// app/clientRouter.tsx
import { ssr } from "@carvajalconsultants/headstart/client";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { Provider } from "urql";
import { client } from "./graphql/clientProvider";
import { routeTree } from "./routeTree.gen";

import type { ReactNode } from "react";
import type { SSRData } from "urql";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		context: {
			client,
		},
		hydrate: (dehydrated) => {
			// Hydrate URQL with data passed by TSR, this is generated by dehydrate function in server router.
			ssr.restoreData(dehydrated.initialData as SSRData);
		},

		// Wrap our entire route with the URQL provider so we can execute queries and mutations.
		Wrap: ({ children }: { children: ReactNode }) => <Provider value={client}>{children}</Provider>,
	});

	return router;
}
```

12. Tell TSR to use our client side router:

```typescript
// app/client.tsx
/// <reference types="vinxi/types/client" />
import { StartClient } from "@tanstack/start";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./clientRouter";

const router = createRouter();

hydrateRoot(document.getElementById("root")!, <StartClient router={router} />);
```

13. Last but not least, you're ready to start using URQL on your components and pages. First we create the route using the loader option so we can pre-load data:

```typescript
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

14. Now in your component, you can query with URQL as you normally would:

```typescript
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

1. Run `yarn run build`
2. `cd .output/server`
3. `rm -rf node_modules`
4. `yarn install`
5. `yarn run index.mjs`
