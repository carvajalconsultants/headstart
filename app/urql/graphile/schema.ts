import { GrafservConfig } from 'grafserv'
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'

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
      resolve: () => ({
        // If I comment the object, we see no data in UI
        edges: [
          { cursor: 'WyJuYXR1cmFsIiwxXQ==', node: { id: '7d7ffafe-eb34-43f4-9c76-ae12ba6d4d3d', name: 'Business', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiwyXQ==', node: { id: '09f2ea0c-bc25-4aa2-b872-a292040e490c', name: 'Charity for childrens', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiwzXQ==', node: { id: '007d75cc-c9f2-43f9-bba4-a500524f9ac1', name: 'Earth Mendors', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiw0XQ==', node: { id: '61e16434-c313-465c-9703-c3ad288324d9', name: 'Giving health', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiw1XQ==', node: { id: '7dcfde38-aada-49d3-b025-98fc7dba5d94', name: 'HELP Miami', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiw2XQ==', node: { id: '49c99d14-eafb-4223-b531-a977f9e67f27', name: 'Hope House', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiw3XQ==', node: { id: '07a730d1-18c0-4a75-bae7-71ea6f5774fb', name: "Mel's Charity", __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiw4XQ==', node: { id: '7b3d8287-ba0a-47f5-a70f-fb4c8cf2bf90', name: 'Miguels Charitys', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiw5XQ==', node: { id: '1c514d4a-ee52-47b3-b943-f1dc2d5e4702', name: 'SASFBe4', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiwxMF0=', node: { id: '672cf5dd-084d-4715-add5-45885c8e148b', name: 'SASF Charitys', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiwxMV0=', node: { id: '569519e7-0431-45ab-9800-e5bd8390c89f', name: 'Tech Business', __typename: 'Account' }, __typename: 'AccountsEdge' },
          { cursor: 'WyJuYXR1cmFsIiwxMl0=', node: { id: 'b28bc08e-2a05-48f5-8008-813e12b401a4', name: 'Unity in Action', __typename: 'Account' }, __typename: 'AccountsEdge' },
        ],
        __typename: 'AccountsConnection',
      }),
    },
  },
})

export const schema: GrafservConfig['schema'] = new GraphQLSchema({
  query: queryType,
})
