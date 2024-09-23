import { Client, cacheExchange, fetchExchange, ssrExchange } from 'urql'

export const ssr = ssrExchange({ isClient: false })

const client = new Client({
  url: `${import.meta.env.VITE_PUBLIC_WEB_SERVICE_URL ?? ''}/graphql`,
  exchanges: [cacheExchange, ssr, fetchExchange],
})

export default client
