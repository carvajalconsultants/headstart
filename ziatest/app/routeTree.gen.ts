/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UrqlImport } from './routes/urql'
import { Route as RedirectImport } from './routes/redirect'
import { Route as DeferredImport } from './routes/deferred'
import { Route as ContactImport } from './routes/contact'
import { Route as IndexImport } from './routes/index'
import { Route as LayoutLayout2Import } from './routes/_layout/_layout-2'
import { Route as LayoutLayout2LayoutBImport } from './routes/_layout/_layout-2/layout-b'
import { Route as LayoutLayout2LayoutAImport } from './routes/_layout/_layout-2/layout-a'

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')()

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const UrqlRoute = UrqlImport.update({
  path: '/urql',
  getParentRoute: () => rootRoute,
} as any)

const RedirectRoute = RedirectImport.update({
  path: '/redirect',
  getParentRoute: () => rootRoute,
} as any)

const DeferredRoute = DeferredImport.update({
  path: '/deferred',
  getParentRoute: () => rootRoute,
} as any)

const ContactRoute = ContactImport.update({
  path: '/contact',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutLayout2Route = LayoutLayout2Import.update({
  id: '/_layout/_layout-2',
  getParentRoute: () => rootRoute,
} as any)

const LayoutLayout2LayoutBRoute = LayoutLayout2LayoutBImport.update({
  path: '/layout-b',
  getParentRoute: () => LayoutLayout2Route,
} as any)

const LayoutLayout2LayoutARoute = LayoutLayout2LayoutAImport.update({
  path: '/layout-a',
  getParentRoute: () => LayoutLayout2Route,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/contact': {
      id: '/contact'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactImport
      parentRoute: typeof rootRoute
    }
    '/deferred': {
      id: '/deferred'
      path: '/deferred'
      fullPath: '/deferred'
      preLoaderRoute: typeof DeferredImport
      parentRoute: typeof rootRoute
    }
    '/redirect': {
      id: '/redirect'
      path: '/redirect'
      fullPath: '/redirect'
      preLoaderRoute: typeof RedirectImport
      parentRoute: typeof rootRoute
    }
    '/urql': {
      id: '/urql'
      path: '/urql'
      fullPath: '/urql'
      preLoaderRoute: typeof UrqlImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_layout-2': {
      id: '/_layout/_layout-2'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutLayout2Import
      parentRoute: typeof rootRoute
    }
    '/_layout/_layout-2/layout-a': {
      id: '/_layout/_layout-2/layout-a'
      path: '/layout-a'
      fullPath: '/layout-a'
      preLoaderRoute: typeof LayoutLayout2LayoutAImport
      parentRoute: typeof LayoutLayout2Import
    }
    '/_layout/_layout-2/layout-b': {
      id: '/_layout/_layout-2/layout-b'
      path: '/layout-b'
      fullPath: '/layout-b'
      preLoaderRoute: typeof LayoutLayout2LayoutBImport
      parentRoute: typeof LayoutLayout2Import
    }
  }
}

// Create and export the route tree

interface LayoutLayout2RouteChildren {
  LayoutLayout2LayoutARoute: typeof LayoutLayout2LayoutARoute
  LayoutLayout2LayoutBRoute: typeof LayoutLayout2LayoutBRoute
}

const LayoutLayout2RouteChildren: LayoutLayout2RouteChildren = {
  LayoutLayout2LayoutARoute: LayoutLayout2LayoutARoute,
  LayoutLayout2LayoutBRoute: LayoutLayout2LayoutBRoute,
}

const LayoutLayout2RouteWithChildren = LayoutLayout2Route._addFileChildren(
  LayoutLayout2RouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/contact': typeof ContactRoute
  '/deferred': typeof DeferredRoute
  '/redirect': typeof RedirectRoute
  '/urql': typeof UrqlRoute
  '/about': typeof AboutLazyRoute
  '': typeof LayoutLayout2RouteWithChildren
  '/layout-a': typeof LayoutLayout2LayoutARoute
  '/layout-b': typeof LayoutLayout2LayoutBRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/contact': typeof ContactRoute
  '/deferred': typeof DeferredRoute
  '/redirect': typeof RedirectRoute
  '/urql': typeof UrqlRoute
  '/about': typeof AboutLazyRoute
  '': typeof LayoutLayout2RouteWithChildren
  '/layout-a': typeof LayoutLayout2LayoutARoute
  '/layout-b': typeof LayoutLayout2LayoutBRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/contact': typeof ContactRoute
  '/deferred': typeof DeferredRoute
  '/redirect': typeof RedirectRoute
  '/urql': typeof UrqlRoute
  '/about': typeof AboutLazyRoute
  '/_layout/_layout-2': typeof LayoutLayout2RouteWithChildren
  '/_layout/_layout-2/layout-a': typeof LayoutLayout2LayoutARoute
  '/_layout/_layout-2/layout-b': typeof LayoutLayout2LayoutBRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/contact'
    | '/deferred'
    | '/redirect'
    | '/urql'
    | '/about'
    | ''
    | '/layout-a'
    | '/layout-b'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/contact'
    | '/deferred'
    | '/redirect'
    | '/urql'
    | '/about'
    | ''
    | '/layout-a'
    | '/layout-b'
  id:
    | '__root__'
    | '/'
    | '/contact'
    | '/deferred'
    | '/redirect'
    | '/urql'
    | '/about'
    | '/_layout/_layout-2'
    | '/_layout/_layout-2/layout-a'
    | '/_layout/_layout-2/layout-b'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ContactRoute: typeof ContactRoute
  DeferredRoute: typeof DeferredRoute
  RedirectRoute: typeof RedirectRoute
  UrqlRoute: typeof UrqlRoute
  AboutLazyRoute: typeof AboutLazyRoute
  LayoutLayout2Route: typeof LayoutLayout2RouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ContactRoute: ContactRoute,
  DeferredRoute: DeferredRoute,
  RedirectRoute: RedirectRoute,
  UrqlRoute: UrqlRoute,
  AboutLazyRoute: AboutLazyRoute,
  LayoutLayout2Route: LayoutLayout2RouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/contact",
        "/deferred",
        "/redirect",
        "/urql",
        "/about",
        "/_layout/_layout-2"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/contact": {
      "filePath": "contact.tsx"
    },
    "/deferred": {
      "filePath": "deferred.tsx"
    },
    "/redirect": {
      "filePath": "redirect.tsx"
    },
    "/urql": {
      "filePath": "urql.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/_layout/_layout-2": {
      "filePath": "_layout/_layout-2.tsx",
      "children": [
        "/_layout/_layout-2/layout-a",
        "/_layout/_layout-2/layout-b"
      ]
    },
    "/_layout/_layout-2/layout-a": {
      "filePath": "_layout/_layout-2/layout-a.tsx",
      "parent": "/_layout/_layout-2"
    },
    "/_layout/_layout-2/layout-b": {
      "filePath": "_layout/_layout-2/layout-b.tsx",
      "parent": "/_layout/_layout-2"
    }
  }
}
ROUTE_MANIFEST_END */
