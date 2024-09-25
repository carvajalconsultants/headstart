import { createAPIFileRoute } from '@tanstack/start/api'

export const Route = createAPIFileRoute('/api/hello')({
  GET: async ({ request }) => {
    return new Response(JSON.stringify({ message: 'Hello, World!' }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
