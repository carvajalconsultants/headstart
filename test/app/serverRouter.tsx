// app/router.tsx
import { createRouter as createTanStackRouter, Link } from '@tanstack/react-router'
import { client, GraphProvider } from './graphql/serverProvider'
import { routeTree } from './routeTree.gen'

export function createRouter() {  
  const router = createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not found!</p>
          <Link to="/">Go home</Link>
        </div>
      )
    },
    context: {
      client,
    },
    dehydrate: () => {
      console.log("dehydrate called????");
      return { initialData: {hello: "test"} };
    },
    hydrate: (dehydrated) => {
      // hydrate(queryClient, dehydrated.queryClientState)
      console.log("hydrate called dehydrated", dehydrated);
    },
    Wrap: ({ children }) => {
      return <GraphProvider>{children}</GraphProvider>
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
