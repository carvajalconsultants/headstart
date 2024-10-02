import 'postgraphile' // To import the TypeScript types
import { makePgService } from 'postgraphile/adaptors/pg'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'

import { makeExtendSchemaPlugin } from 'postgraphile/utils'
import { context, lambda, listen } from 'postgraphile/grafast'
import { jsonParse } from 'postgraphile/@dataplan/json'
import { schema } from 'graphQLRouteHandler'
import { gql } from 'urql'

const MySubscriptionPlugin = makeExtendSchemaPlugin(build => {
  const { messages } = build.input.pgRegistry.pgResources
  return {
    typeDefs: gql`
      type CharityMessageSubscriptionPayload {
        event: String!
        message: Charity!
      }

      type Charity {
        id: ID!
        name: String!
      `,
    plans: {
      Subscription: {
        charityMessage: {
          subscribePlan(_$root, args) {
            const $pgSubscriber = context().get('pgSubscriber')
            const $charityId = args.get('charityId')
            const $topic = lambda($charityId, id => `charity:${id}:message`)
            return listen($pgSubscriber, $topic, jsonParse)
          },
          plan($event) {
            return $event
          },
        },
      },
      CharityMessageSubscriptionPayload: {
        event($event) {
          return $event.get('event')
        },
        message($event) {
          const $id = $event.get('id')
          return messages.get({ id: $id })
        },
      },
    },
  }
})

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset],
  grafserv: { port: 5678, graphiql: true, websockets: true, watch: true, graphqlPath: '/api', eventStreamPath: '/api' },
  pgServices: [
    makePgService({
      connectionString: 'postgres://zia:zia123@localhost:5432/headstart',

      // Enable LISTEN/NOTIFY (for subscriptions/watch mode)
      pubsub: true,
    }),
  ],
  // pgServices: [makePgService({ connectionString: 'postgres://localhost/headstart' })],
  plugins: [MySubscriptionPlugin],
}

export default preset
