import { createClient as createWSClient } from 'graphql-ws'

// Web Service URL
const WEB_SERVICE_URL = import.meta.env.VITE_PUBLIC_WEB_SERVICE_URL || 'https://ws.origos.io'
export const GRAPHQL_SERVICE_URL = `${WEB_SERVICE_URL}/graphql`
const WS_URL = GRAPHQL_SERVICE_URL.replace(/^http/, 'ws')

let wsClient: ReturnType<typeof createWSClient>

if (typeof window !== 'undefined') {
  // Client-side
  wsClient = createWSClient({
    url: WS_URL,
  })
} else {
  // Server-side
  import('ws').then((WebSocket) => {
    wsClient = createWSClient({
      url: WS_URL,
      webSocketImpl: WebSocket.default,
    })
  })
}

export { wsClient }
