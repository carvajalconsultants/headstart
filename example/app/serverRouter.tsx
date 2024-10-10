// app/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { client, GraphProvider } from './graphql/serverProvider'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      client,
    },
    Wrap: ({ children }) => {
console.log("WRAP CALLED!!!!!!");
      return <GraphProvider>{children}</GraphProvider>;
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
