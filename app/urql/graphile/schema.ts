import { GrafservConfig } from 'grafserv'
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { pool } from '../pg'

const AccountType = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    __typename: { type: new GraphQLNonNull(GraphQLString) },
  },
})

const AccountsEdgeType = new GraphQLObjectType({
  name: 'AccountsEdge',
  fields: {
    cursor: { type: new GraphQLNonNull(GraphQLString) },
    node: { type: new GraphQLNonNull(AccountType) },
    __typename: { type: new GraphQLNonNull(GraphQLString) },
  },
})

const AccountsConnectionType = new GraphQLObjectType({
  name: 'AccountsConnection',
  fields: {
    edges: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AccountsEdgeType))) },
    __typename: { type: new GraphQLNonNull(GraphQLString) },
  },
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    charities: {
      type: new GraphQLNonNull(AccountsConnectionType),
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const result = await pool.query('SELECT id, name FROM charities')
          const edges = result.rows.map((row, index) => ({
            cursor: Buffer.from(`natural,${index + 1}`).toString('base64'),
            node: { ...row, __typename: 'Account' },
            __typename: 'AccountsEdge',
          }))
          return {
            edges,
            __typename: 'AccountsConnection',
          }
        } catch (error) {
          console.error('Error fetching charities:', error)
          return { edges: [], __typename: 'AccountsConnection' }
        }
      },
    },
  },
})

export const schema: GrafservConfig['schema'] = new GraphQLSchema({
  query: queryType,
})
