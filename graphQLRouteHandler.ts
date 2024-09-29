// Here we should make an includable function or something that when include, initializes the /graphql route in Tanstack Start (just by including it)
// Example from: https://postgraphile.org/postgraphile/next/usage-library

import { json } from '@tanstack/start'
import { createAPIFileRoute, createAPIRoute, HTTP_API_METHOD, StartAPIMethodCallback } from '@tanstack/start/api'

/*
import { createServer } from "node:http";
import express from "express";
import { grafserv } from "postgraphile/grafserv/express/v4";
import { pgl } from "./pgl.js";

const serv = pgl.createServ(grafserv);

const app = express();
const server = createServer(app);
server.on("error", () => {});
serv.addTo(app, server).catch((e) => {
  process.exit(1);
  console.error(e);
});
server.listen(5678);

console.log("Server listening at http://localhost:5678");
*/

//TODO This is the funciont that should be specified in graphql.ts api route
export const createGraphQLRouteHandler = <TPath extends string>(): Partial<Record<HTTP_API_METHOD, StartAPIMethodCallback<TPath>>> => {
  console.log("INITIALIZE?????");
  
  return ({
    GET: async ({ request }) => {
      return json({ message: 'Hello /api/graphql' + new Date().getTime() })
    },
})}