import type { IncomingMessage } from 'node:http'
import type { Hooks, Peer } from 'crossws'
import type { H3Grafserv } from 'grafserv/h3/v1'
import { CloseCode, makeServer } from 'graphql-ws'
import { makeGraphQLWSConfig } from 'postgraphile/grafserv'
import type { WebSocket } from 'ws'

export function makeWsHandler(instance: H3Grafserv): Partial<Hooks> {
  const graphqlWsServer = makeServer(makeGraphQLWSConfig(instance))

  const open = (peer: Peer<{ node: { ws: WebSocket; req: IncomingMessage } }>) => {
    const { ws: socket, req: request } = peer.ctx.node

    const closed = graphqlWsServer.opened({
      protocol: socket.protocol,
      send: (data) => new Promise((resolve, reject) => {
        socket.send(data, (err: any) => (err ? reject(err) : resolve()))
      }),
      close: (code, reason) => socket.close(code, reason),
      onMessage: (cb) => socket.addEventListener('message', async (event) => {
        console.log(event.data.toString())
        try {
          await cb(event.data.toString())
        } catch (err: any) {
          try {
            socket.close(CloseCode.InternalServerError, err.message)
          } catch {
            /*noop*/
          }
        }
      }),
    }, { peer, socket, request })

    socket.addEventListener('close', (e) => closed(e.code, e.reason), { once: true })
  }

  return { open }
}
