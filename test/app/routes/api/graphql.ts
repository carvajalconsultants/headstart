import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { createGraphQLRouteHandler } from '../../../../graphQLRouteHandler'

export const Route = createAPIFileRoute('/api/graphql')(createGraphQLRouteHandler<"/api/graphql">())
