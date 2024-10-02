/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UrqlImport } from './routes/urql'
import { Route as SubscriptionImport } from './routes/subscription'
import { Route as MultipleQueriesImport } from './routes/multiple-queries'
import { Route as DialogImport } from './routes/dialog'
import { Route as AddCharityImport } from './routes/add-charity'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const UrqlRoute = UrqlImport.update({
  path: '/urql',
  getParentRoute: () => rootRoute,
} as any)

const SubscriptionRoute = SubscriptionImport.update({
  path: '/subscription',
  getParentRoute: () => rootRoute,
} as any)

const MultipleQueriesRoute = MultipleQueriesImport.update({
  path: '/multiple-queries',
  getParentRoute: () => rootRoute,
} as any)

const DialogRoute = DialogImport.update({
  path: '/dialog',
  getParentRoute: () => rootRoute,
} as any)

const AddCharityRoute = AddCharityImport.update({
  path: '/add-charity',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
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
    '/add-charity': {
      id: '/add-charity'
      path: '/add-charity'
      fullPath: '/add-charity'
      preLoaderRoute: typeof AddCharityImport
      parentRoute: typeof rootRoute
    }
    '/dialog': {
      id: '/dialog'
      path: '/dialog'
      fullPath: '/dialog'
      preLoaderRoute: typeof DialogImport
      parentRoute: typeof rootRoute
    }
    '/multiple-queries': {
      id: '/multiple-queries'
      path: '/multiple-queries'
      fullPath: '/multiple-queries'
      preLoaderRoute: typeof MultipleQueriesImport
      parentRoute: typeof rootRoute
    }
    '/subscription': {
      id: '/subscription'
      path: '/subscription'
      fullPath: '/subscription'
      preLoaderRoute: typeof SubscriptionImport
      parentRoute: typeof rootRoute
    }
    '/urql': {
      id: '/urql'
      path: '/urql'
      fullPath: '/urql'
      preLoaderRoute: typeof UrqlImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/add-charity': typeof AddCharityRoute
  '/dialog': typeof DialogRoute
  '/multiple-queries': typeof MultipleQueriesRoute
  '/subscription': typeof SubscriptionRoute
  '/urql': typeof UrqlRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/add-charity': typeof AddCharityRoute
  '/dialog': typeof DialogRoute
  '/multiple-queries': typeof MultipleQueriesRoute
  '/subscription': typeof SubscriptionRoute
  '/urql': typeof UrqlRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/add-charity': typeof AddCharityRoute
  '/dialog': typeof DialogRoute
  '/multiple-queries': typeof MultipleQueriesRoute
  '/subscription': typeof SubscriptionRoute
  '/urql': typeof UrqlRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/add-charity'
    | '/dialog'
    | '/multiple-queries'
    | '/subscription'
    | '/urql'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/add-charity'
    | '/dialog'
    | '/multiple-queries'
    | '/subscription'
    | '/urql'
  id:
    | '__root__'
    | '/'
    | '/add-charity'
    | '/dialog'
    | '/multiple-queries'
    | '/subscription'
    | '/urql'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AddCharityRoute: typeof AddCharityRoute
  DialogRoute: typeof DialogRoute
  MultipleQueriesRoute: typeof MultipleQueriesRoute
  SubscriptionRoute: typeof SubscriptionRoute
  UrqlRoute: typeof UrqlRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AddCharityRoute: AddCharityRoute,
  DialogRoute: DialogRoute,
  MultipleQueriesRoute: MultipleQueriesRoute,
  SubscriptionRoute: SubscriptionRoute,
  UrqlRoute: UrqlRoute,
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
        "/add-charity",
        "/dialog",
        "/multiple-queries",
        "/subscription",
        "/urql"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/add-charity": {
      "filePath": "add-charity.tsx"
    },
    "/dialog": {
      "filePath": "dialog.tsx"
    },
    "/multiple-queries": {
      "filePath": "multiple-queries.tsx"
    },
    "/subscription": {
      "filePath": "subscription.tsx"
    },
    "/urql": {
      "filePath": "urql.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
