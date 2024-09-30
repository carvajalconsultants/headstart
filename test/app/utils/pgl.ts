import pkg from 'pg'

const { Pool } = pkg

// Create a new pool
export const pool = new Pool({
  user: 'zia',
  host: 'localhost',
  database: 'headstart',
  password: 'zia123',
  port: 5432,
})
