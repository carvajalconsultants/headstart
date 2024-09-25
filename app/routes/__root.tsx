// app/routes/__root.tsx
import { createRootRoute, Link } from '@tanstack/react-router'
import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import UrqlSSRProvider from '../urql/urql-ssr-provider'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import { ToPathOption } from '@tanstack/react-router'

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    ...seo({
      title: 'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
      description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
    }),
  ],
  scripts: () => [
    {
      src: 'https://cdn.tailwindcss.com',
    },
    {
      type: 'module',
      children: `import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true`,
    },
    {
      type: 'module',
      src: '/@vite/client',
    },
    {
      type: 'module',
      src: '/src/entry-client.tsx',
    },
  ],
  links: () => [
    { rel: 'stylesheet', href: appCss },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
    { rel: 'icon', href: '/favicon.ico' },
  ],
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <UrqlSSRProvider>
        <Outlet />
      </UrqlSSRProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const navItems = [
    { to: '/', label: 'Home', exact: true },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/layout-a', label: 'Layout' },
    { to: '/deferred', label: 'Deferred' },
    { to: '/this-route-does-not-exist', label: 'This Route Does Not Exist', tsExpectError: true },
    { to: '/api/hello', label: '/api/hello' },
  ]

  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <div className="p-2 flex gap-4 text-lg">
          {navItems.map(item => (
            <React.Fragment key={item.to}>
              <Link
                to={item.to}
                activeProps={{
                  className: 'underline underline-offset-4',
                }}
                className="text-blue-500 hover:text-blue-600 p-2"
                activeOptions={item.exact ? { exact: true } : undefined}>
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <hr />

        <main className="p-4">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}
