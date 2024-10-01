import { Client, cacheExchange, ssrExchange, fetchExchange } from 'urql'

import { Provider } from 'urql'
import { FC, ReactElement } from 'react'

const client = new Client({
  url: "http://localhost:3000/api",
  requestPolicy: 'cache-and-network',
  exchanges: [cacheExchange, fetchExchange],
})

export default client

export const GraphProvider: FC<{children: ReactElement}> = ({children}) => (<Provider value={client}>{children}</Provider>);
