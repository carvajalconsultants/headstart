// app/api.ts
import { createGraphQLRouteHandler } from '../graphQLRouteHandler'
import preset from '../graphile.config'

export default createGraphQLRouteHandler(preset)
