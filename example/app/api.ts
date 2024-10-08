// app/api.ts
import { createGraphQLRouteHandler } from "../headstart";
import { pgl } from "../pgl";

export default createGraphQLRouteHandler(pgl);
