import { pool } from "~/urql/pg"

async function setupDatabase() {
  try {
    // Create the charities table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS charities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL
      )
    `)

    // Create a unique index on the name column
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS charities_name_idx ON charities (name)
    `)

    const charities = [
      'Business',
      'Charity for childrens',
      'Earth Mendors',
      'Giving health',
      'HELP Miami',
      'Hope House',
      'Mel\'s Charity',
      'Miguels Charitys',
      'SASFBe4',
      'SASF Charitys',
      'Tech Business',
      'Unity in Action'
    ]

    for (const charity of charities) {
      await pool.query('INSERT INTO charities (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [charity])
    }

    console.log('Database setup completed successfully')
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    await pool.end()
  }
}

setupDatabase()
