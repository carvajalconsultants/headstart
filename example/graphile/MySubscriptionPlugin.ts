import { jsonParse } from "@dataplan/json";
import { context, lambda, listen } from "postgraphile/grafast";
import { gql, makeExtendSchemaPlugin } from "postgraphile/utils";

export const MySubscriptionPlugin = makeExtendSchemaPlugin((build) => {
	const { charities } = build.input.pgRegistry.pgResources;

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
						const $pgSubscriber = context().get("pgSubscriber");
						// const $charityId = args.get('charityId') || 55
						// const $topic = lambda($charityId, id => `charity:${id}`)
						const $topic = "charity";
						return listen($pgSubscriber, $topic, jsonParse);
					},

					plan($event) {
						return $event;
					},
				},
			},

			CharitySubscriptionPayload: {
				event($event) {
					return $event.get("event");
				},

				charity($event) {
					const $id = $event.get("id");
					return charities.get({ id: $id });
				},
			},
		},
	};
});
