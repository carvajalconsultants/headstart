// app/ssr.tsx
/// <reference types="vinxi/types/server" />
import { getRouterManifest } from '@tanstack/start/router-manifest'
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/start/server'

import { createCustomHandler } from './middlewareHandler'
import { createRouter } from './router'


const handler = createStartHandler({
  createRouter,
  getRouterManifest,
})

const customHandler = createCustomHandler(handler)

export default customHandler(defaultStreamHandler)

// export default createStartHandler({
//   createRouter,
//   getRouterManifest,
// })(defaultStreamHandler)
