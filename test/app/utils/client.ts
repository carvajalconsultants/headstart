import { Client, cacheExchange, fetchExchange } from 'urql'
import { ssr } from './common'
import { GRAPHQL_SERVICE_URL } from './constants'

const client = new Client({
  url: GRAPHQL_SERVICE_URL,
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, ssr, fetchExchange],
})

export default client
