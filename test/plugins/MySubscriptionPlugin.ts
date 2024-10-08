
import { gql, makeExtendSchemaPlugin } from 'postgraphile/utils'
import { context, lambda, listen } from 'postgraphile/grafast'
import { jsonParse } from 'postgraphile/@dataplan/json'

export const MySubscriptionPlugin = makeExtendSchemaPlugin(build =>  {
    const { charities } = build.input.pgRegistry.pgResources

    return {
      typeDefs: gql`
        type CharitySubscriptionPayload {
          event: String
          charity: Charity
        }

        extend type Subscription {
          charities: CharitySubscriptionPayload
        }
      `,
      plans: {
        Subscription: {
          charities: {
            subscribePlan(_$root, args) {
console.log("subscribePLan", args);
              const $pgSubscriber = context().get('pgSubscriber')
              // const $charityId = args.get('charityId') || 55
              // const $topic = lambda($charityId, id => `charity:${id}`)
              const $topic = "charity"
console.log("LISTEN TIME", $topic);
              return listen($pgSubscriber, $topic, jsonParse)
            },
            plan($event) {
              return $event
            },
          },
        },

        CharitySubscriptionPayload: {
          event($event) {
console.log("event");
            return $event.get('event')
          },
          charity($event) {
            const $id = $event.get('id')
console.log("get here??");
            return charities.get({ id: $id })
          },
        },
      },
    }
  })