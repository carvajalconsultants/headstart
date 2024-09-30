import { GrafservConfig } from 'grafserv'
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { pool } from './pgl'

const CharityType = new GraphQLObjectType({
  name: 'Charity',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
})

const AllCharitiesType = new GraphQLObjectType({
  name: 'AllCharities',
  fields: {
    nodes: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CharityType))) },
  },
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    allCharities: {
      type: new GraphQLNonNull(AllCharitiesType),
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          const result = await pool.query('SELECT id, name FROM charities')
          const nodes = result.rows.map(row => ({
            id: Buffer.from(`Charity,${row.id}`).toString('base64'),
            name: row.name,
          }))
          return {
            nodes,
          }
        } catch (error) {
          console.error('Error fetching charities:', error)
          return { nodes: [] }
        }
      },
    },
  },
})

export const schema: GrafservConfig['schema'] = new GraphQLSchema({
  query: queryType,
})
