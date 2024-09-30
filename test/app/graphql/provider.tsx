import { Client, cacheExchange, ssrExchange, fetchExchange } from 'urql'
import { grafastExchange } from '../grafastExchange'

import { Provider } from 'urql'
import { FC, ReactElement, ReactNode } from 'react'


export const isServerSide = typeof window === 'undefined'

export const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

const client = new Client({
  url: "http://localhost:3000/api",
  requestPolicy: 'cache-and-network',
  // exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
  exchanges: [cacheExchange, grafastExchange, fetchExchange],
})

export default client


export const GraphProvider: FC<{children: ReactElement}> = ({children}) => (<Provider value={client}>{children}</Provider>);
