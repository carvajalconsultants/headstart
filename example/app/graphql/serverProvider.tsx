import { Client, Provider } from "urql";
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
