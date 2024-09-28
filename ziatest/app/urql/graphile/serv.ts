import { grafserv } from 'grafserv/h3/v1'
import { createApp, toNodeListener } from 'h3'
import { createServer } from 'node:http'
import { preset } from './preset'
import { schema } from './schema'

// create a h3 app
const app = createApp()
// (Add any h3 eventHandlers you want here.)

// Create a Node HTTP server, mounting h3 into it
const server = createServer(toNodeListener(app))
server.on('error', e => {
  console.error(e)
})

// Create a Grafserv instance
export const serv = grafserv({ schema, preset })

// Add the Grafserv instance's route handlers to the h3 app
serv.addTo(app).catch(e => {
  console.error(e)
  process.exit(1)
})

// Start the server
server.listen(preset.grafserv?.port ?? 5678)
