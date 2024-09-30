import pkg from 'pg'

const { Pool } = pkg

// Create a new pool
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'headstart',
  port: 5432,
})
