// app/api.ts
import {
    createStartAPIHandler,
    defaultAPIFileRouteHandler,
  } from '@tanstack/start/api'
import { defineWebSocket, eventHandler } from 'vinxi/http'
import { createGraphQLRouteHandler } from '../graphQLRouteHandler'
import preset from "../graphile.config";

export default createGraphQLRouteHandler(preset);
// export default eventHandler({
//     handler: (event) => {
// console.log("event??");
// return "done??";
//     }
// });