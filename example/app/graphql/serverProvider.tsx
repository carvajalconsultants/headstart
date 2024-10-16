import { Client, Provider } from "urql";
import { grafastExchange } from "../../headstart/grafastExchange";
import { pgl } from "../../pgl";
import { ssr } from "./ssrExchange";

import type { FC, ReactElement } from "react";

// TODO Very straightforward, should be in headstart and not have to be defined in each project
export const client = new Client({
	url: "dummy",
	exchanges: [ssr, grafastExchange(pgl)],
});

//TODO Do we still need this? If so, is there a way to unify as its also in clientProvider
export const GraphProvider: FC<{ children: ReactElement }> = ({ children }) => (
	<Provider value={client}>{children}</Provider>
);
