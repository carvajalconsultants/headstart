// Here we should make an includable function or something that when include, initializes the /graphql route in Tanstack Start (just by including it)
// Example from: https://postgraphile.org/postgraphile/next/usage-library

import { pgl } from "./pgl";
import { graphQLRouteHandler } from "@carvajalconsultants/headstart";
//import { createAPIFileRoute, createAPIRoute } from '@tanstack/start/api'


// Here is the auto-generated schema by Postgraphile, we may need it at some point
const schema = await pgl.getSchema();
