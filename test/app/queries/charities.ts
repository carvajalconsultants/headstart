import { gql } from 'urql'

// Sample query to test urql
export const charitiesQuery = gql`
  query allCharities {
    allCharities {
      nodes {
        id
        name
      }
    }
  }
`
