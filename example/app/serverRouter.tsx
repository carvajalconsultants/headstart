// app/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { client, GraphProvider } from './graphql/serverProvider'
import { ssr } from './graphql/ssrExchange'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      client,
    },
    // Send data to client so URQL can be hydrated.
    dehydrate: () => ({ initialData: ssr.extractData() }),
    Wrap: ({ children }) => <GraphProvider>{children}</GraphProvider>,
  })

  return router
}
