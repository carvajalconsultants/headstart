import { GrafservConfig } from 'grafserv'
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, World!',
    },
  },
})

export const schema: GrafservConfig['schema'] = new GraphQLSchema({
  query: queryType,
  
})
