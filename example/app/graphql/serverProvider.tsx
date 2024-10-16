import { FC, ReactElement } from 'react'
import { Client, Provider, ssrExchange, fetchExchange } from 'urql'
// import client from '../urql'
import { grafastExchange } from '../../headstart/grafastExchange';
import { pgl } from "../../pgl";

import { ssr } from "./ssrExchange";

export const client = new Client({
  url: 'http://localhost:3000/api',
  requestPolicy: 'network-only',
  exchanges: [ssr, grafastExchange(pgl)],
  // exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
  // suspense: true,
})

export const GraphProvider: FC<{ children: ReactElement }> = ({ children }) => <Provider value={client}>{children}</Provider>
