import { ssrExchange } from 'urql'

import pkg from 'pg'

const { Pool } = pkg

export const isServerSide = typeof window === 'undefined'
export const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

// Create a new pool
export const pool = new Pool({
  user: 'zia',
  host: 'localhost',
  database: 'headstart',
  password: 'zia123',
  port: 5432,
})
