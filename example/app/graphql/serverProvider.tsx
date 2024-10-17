import { Client, Provider } from "urql";
import { grafastExchange } from "../../headstart/grafastExchange";
import { pgl } from "../../pgl";
import { ssr } from "../../headstart/ssrExchange";

// TODO Very straightforward, should be in headstart and not have to be defined in each project
export const client = new Client({
	url: ".",
	exchanges: [ssr, grafastExchange(pgl)],
});
