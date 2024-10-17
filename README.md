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

3. Add the api.ts file so that it calls our GraphQL handler. This will receive all GraphQL requests at the /api endpoint.

	// app/api.ts
	import { createGraphQLRouteHandler } from "@carvajalconsultants/headstart";
	import { pgl } from "../pgl";
	
	export default createGraphQLRouteHandler(pgl);

4. Enable WebSocket in `app.config.ts` if you need it:
	// app.config.ts
	import { defineConfig } from "@tanstack/start/config";
	
	export default defineConfig({
		server: {
			experimental: {
				websocket: true,
			},
		},
	});


