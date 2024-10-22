// app/api.ts
import { defaultAPIFileRouteHandler } from "@tanstack/start/api";
import { createStartAPIHandler } from "../headstart";
import { pgl } from "../pgl";

export default createStartAPIHandler(pgl, defaultAPIFileRouteHandler);
