import { Client, cacheExchange, fetchExchange, ssrExchange } from 'urql'
import { grafastExchange } from './grafastExchange'

// Web Service URL
export const WEB_SERVICE_URL = import.meta.env.VITE_PUBLIC_WEB_SERVICE_URL || 'https://ws.origos.io'

// GraphQL endpoint that executes queries and mutations
export const GRAPHQL_SERVICE_URL = `${WEB_SERVICE_URL}/graphql`

// export const ssr = ssrExchange({ isClient: false })
// const ssr = ssrExchange({ isClient: false, initialState: ssrCache })
const isServerSide = typeof window === 'undefined'
const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

const client = new Client({
  url: GRAPHQL_SERVICE_URL,

  // Optimize for the best user experience, we want to show the data as fast as possible
  requestPolicy: 'cache-and-network',

  exchanges: [cacheExchange, ssr, fetchExchange, grafastExchange],
})

export default client
