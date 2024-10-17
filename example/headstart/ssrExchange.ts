import { ssrExchange } from "urql";

const isServerSide = typeof window === "undefined";

/**
 * URQL Exchange for server-side rendering.
 * 
 * It is used on the client and server.
 * 
 * On the server, it rounds up the data so that it can be sent to the client to hydrate.
 * 
 * On the client side, it assists in hydrating the data so we don't hit the server with data we already have.
 */
export const ssr = ssrExchange({
	isClient: !isServerSide,
});
