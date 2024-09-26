import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'

export const Route = createAPIFileRoute('/api/graphql')({
  GET: ({ request, params }) => {
    return json({ message: 'Hello /api/graphql' })
  },
})
