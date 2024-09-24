import { createError, eventHandler, getHeader } from 'h3'
import { makeWsHandler } from '../websocket'
import { serv } from '../graphile/serv'

export default eventHandler({
  /**
   * HTTP request handler
   */
  handler: event => {
    if (!event.context.user) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    // Because all are in the same endpoint (graphql, graphiql, and eventStream)
    return getHeader(event, 'accept') === 'text/event-stream' ? serv.handleEventStreamEvent(event) : serv.handleGraphQLEvent(event)
  },
  /**
   * WS request handler
   */
  websocket: makeWsHandler(serv),
})
