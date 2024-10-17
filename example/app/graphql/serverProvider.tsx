import { Client, Provider } from "urql";
import { grafastExchange } from "../../headstart/grafastExchange";
import { pgl } from "../../pgl";
import { ssr } from "../../headstart/ssrExchange";

/**
 * Configure URQL for server side querying with Grafast.
 * 
 * This removes the need to make an HTTP request to ourselves and simply executes the GraphQL query.
 */
export const client = new Client({
	url: ".",
	exchanges: [ssr, grafastExchange(pgl)],
});
