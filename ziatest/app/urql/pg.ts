import pkg from 'pg'

const { Pool } = pkg

// Create a new pool
export const pool = new Pool({
  // user: 'postgres',
  // host: 'localhost',
  // database: 'headstart',
  // port: 5432,

  user: 'zia',
  host: 'localhost',
  database: 'headstart',
  password: 'zia123',
  port: 5432,
})
