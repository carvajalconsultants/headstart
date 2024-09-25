import { gql } from 'urql'

// Sample query to test urql
export const charitiesQuery = gql`
  query charities {
    charities {
      edges {
        cursor
        node {
          id
          name
        }
      }
    }
  }
`
