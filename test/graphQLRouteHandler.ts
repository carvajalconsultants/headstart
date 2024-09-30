// Here we should make an includable function or something that when include, initializes the /graphql route in Tanstack Start (just by including it)
// Example from: https://postgraphile.org/postgraphile/next/usage-library

import { defineWebSocket, eventHandler, getHeader } from 'vinxi/http'

import { grafserv } from "postgraphile/grafserv/h3/v1";

import postgraphile from "postgraphile";

import type { IncomingMessage } from 'node:http';

import type { Hooks, Peer } from 'crossws';
import type { H3Grafserv } from 'grafserv/h3/v1';
import { CloseCode, makeServer } from 'graphql-ws';
import { makeGraphQLWSConfig } from 'postgraphile/grafserv';
import type { WebSocket } from 'ws';

import preset from "./graphile.config";

function makeWsHandler(instance: H3Grafserv): Partial<Hooks> {
  const graphqlWsServer = makeServer(makeGraphQLWSConfig(instance));
  const open = (peer: Peer<{ node: { ws: WebSocket; req: IncomingMessage } }>) => {
    const { ws: socket, req: request } = peer.ctx.node;
    // a new socket opened, let graphql-ws take over
    const closed = graphqlWsServer.opened(
      {
        protocol: socket.protocol, // will be validated
        send: (data) =>
          new Promise((resolve, reject) => {
            socket.send(data, (err: any) => (err ? reject(err) : resolve()));
          }),
        close: (code, reason) => socket.close(code, reason), 
        onMessage: (cb) =>
          socket.addEventListener('message', async (event) => {
            console.log(event.data.toString());
            try {
              await cb(event.data.toString());
            } catch (err: any) {
              try {
                socket.close(CloseCode.InternalServerError, err.message);
              } catch {
                // noop
              }
            }
          }),
      },
      // pass values to the `extra` field in the context
      { peer, socket, request }
    );
    socket.addEventListener('close', (e) => closed(e.code, e.reason), { once: true });
  };
  return { open };
}




export const createGraphQLRouteHandler = (preset: GraphileConfig.Preset) => {
  console.log("INITIALIZE HERE!!!!!!");

  // Our PostGraphile instance:
  const pgl = postgraphile(preset);

  const serv = pgl.createServ(grafserv);
console.log("serv", serv);

// Here is the auto-generated schema by Postgraphile, we may need it at some point
// const schema = await pgl.getSchema();

console.log("before eventHandler???");
  return eventHandler({
    handler: (event) => {
console.log("event??", event);

      // Because all are in the same endpoint (graphql, graphiql, and eventStream)
      return getHeader(event, 'accept') === 'text/event-stream'
      ? serv.handleEventStreamEvent(event)
      : serv.handleGraphQLEvent(event);
    },
    websocket: makeWsHandler(serv),
  });
}