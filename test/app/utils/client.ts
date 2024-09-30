import { Client, cacheExchange, fetchExchange } from 'urql'
import { grafastExchange } from '../grafastExchange'
import { ssr } from './common'

export const GRAPHQL_SERVICE_URL = `http://localhost:3000/api`

const client = new Client({
  url: GRAPHQL_SERVICE_URL,
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, ssr, grafastExchange, fetchExchange],
})

export default client
