import { gql } from 'urql'

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
