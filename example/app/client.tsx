import { StartClient } from "@tanstack/start";
// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./clientRouter";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);
