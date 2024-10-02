import { FC, ReactElement } from 'react'
import { Client, Provider, ssrExchange } from 'urql'
// import client from '../urql'
import { grafastExchange } from '../grafastExchange'


export const isServerSide = typeof window === 'undefined'
export const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

if (!isServerSide) {
  ssr.restoreData((window as any).__URQL_DATA__)
}

export const client = new Client({
  url: 'http://localhost:3000/api',
  requestPolicy: 'cache-and-network',
  exchanges: [grafastExchange],
  // exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
  suspense: true,
})

export const GraphProvider: FC<{ children: ReactElement }> = ({ children }) => <Provider value={client}>{children}</Provider>
