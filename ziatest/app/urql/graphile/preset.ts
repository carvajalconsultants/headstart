import { H3Event, NodeIncomingMessage, NodeServerResponse } from 'h3'

const eventFromIncomingRequest = async (request: NodeIncomingMessage) => {
  // make a h3event for use in context
  const event = new H3Event(request, new NodeServerResponse(request))
  return event
}

export const preset: GraphileConfig.Preset = {
  grafserv: {
    port: 5678,
    host: 'localhost',
    graphqlPath: '/graphql',
    websockets: true,
    graphqlOverGET: true,
  },
  grafast: {
    // context(requestContext, args) {
    //   return {
    //     pgSettings: {
    //       role: "aq_edu_srm_anonymous",
    //       ...args.contextValue?.pgSettings,
    //     },
    //   }
    // }
    async context(ctx, args) {
      // on REST api, use h3event context, on WS, make a falsy h3event
      // @ts-expect-error ws in context
      const event = ctx.h3v1?.event ?? (await eventFromIncomingRequest(ctx.ws.request)) // <=== ctx.ws is provided by makeWsHandler: open hook !
      return {
        ...args.contextValue,
        pgSettings: {
          role: event.context.user?.role,
          'user.id': event.context.user?.id ?? '',
        },
      }
    },
  },
}
