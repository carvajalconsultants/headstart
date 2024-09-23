import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import UrqlSSRProvider from '../urql/urql-ssr-provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-4 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}>
          Home
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}>
          About
        </Link>
        <Link
          to="/contact"
          activeProps={{
            className: 'font-bold',
          }}>
          Contact
        </Link>
        <Link
          to="/urql"
          activeProps={{
            className: 'font-bold',
          }}>
          Urql
        </Link>
      </div>

      <hr />

      <UrqlSSRProvider>
        <Outlet />
      </UrqlSSRProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
