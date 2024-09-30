import { Client, cacheExchange, fetchExchange, ssrExchange } from 'urql'
import { grafastExchange } from '../grafastExchange'

export const GRAPHQL_SERVICE_URL = `http://localhost:3000/api`

export const isServerSide = typeof window === 'undefined'
export const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

const client = new Client({
  url: GRAPHQL_SERVICE_URL,
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
  suspense: true,
})

export default client
