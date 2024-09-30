import { ssrExchange } from 'urql'
import * as postgraphile from 'postgraphile'
import preset from '../../graphile.config'

import pkg from 'pg'

const { Pool } = pkg

export const isServerSide = typeof window === 'undefined'
export const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
})

// Our PostGraphile instance:
export const pgl = postgraphile.postgraphile(preset)

export const schema = pgl.getSchema()

// Create a new pool
export const pool = new Pool({
  user: 'zia',
  host: 'localhost',
  database: 'headstart',
  password: 'zia123',
  port: 5432,
})
