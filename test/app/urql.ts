import { Client, cacheExchange, fetchExchange, ssrExchange } from 'urql'
// import { grafastExchange } from './grafastExchange'

export const isServerSide = typeof window === 'undefined'
export const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

if (!isServerSide) {
  ssr.restoreData((window as any).__URQL_DATA__)
}

const client = new Client({
  url: 'http://localhost:3000/api',
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, ssr, fetchExchange],
  // exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
  suspense: true,
})

export default client
