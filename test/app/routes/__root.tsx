// app/routes/__root.tsx
import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import { GraphProvider } from '../graphql/provider'
import { ssr } from '../urql'

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'TanStack Start Starter',
    },
  ],
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <GraphProvider>
        <Outlet />
      </GraphProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const data = JSON.stringify(ssr.extractData())

  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script dangerouslySetInnerHTML={{ __html: `window.__URQL_DATA__ = ${data};` }} />
      </Body>
    </Html>
  )
}
