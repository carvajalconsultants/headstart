// Here we should make an includable function or something that when include, initializes the /graphql route in Tanstack Start (just by including it)
// Example from: https://postgraphile.org/postgraphile/next/usage-library

import { createAPIFileRoute, createAPIRoute } from '@tanstack/start/api'

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
  console.error(e);
  process.exit(1);
});
server.listen(5678);

console.log("Server listening at http://localhost:5678");
*/

//TODO This is the funciont that should be specified in graphql.ts api route
export const graphQLRouteHandler: CreateAPIRouteFn<"/graphql"> = () => {
  console.log("CREATE GRAPHQL ROUTE!!");
  // this is a test
  createAPIRoute("/graphql")({
    GET: async ({ request }) => {
      return new Response('Hello, World! from ' + request.url)
    },
  });
}