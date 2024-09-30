import { Client, cacheExchange, fetchExchange } from 'urql'
import { GRAPHQL_SERVICE_URL } from '../constants'
import { grafastExchange } from '../lib/grafastExchange'
import { ssr } from './common'

const client = new Client({
  url: GRAPHQL_SERVICE_URL,
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
})

export default client
