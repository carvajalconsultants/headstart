import { Client, cacheExchange, fetchExchange } from 'urql'
import { ssr } from './common'
import { GRAPHQL_SERVICE_URL } from './constants'
import { grafastExchange } from './grafast/grafastExchange'

const client = new Client({
  url: GRAPHQL_SERVICE_URL,
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
})

export default client
