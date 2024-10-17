// app/client.tsx
/// <reference types="vinxi/types/client" />
import { StartClient } from "@tanstack/start";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./clientRouter";

const router = createRouter();

// biome-ignore lint: Safe enough to assume root element will be there
hydrateRoot(document.getElementById("root")!, <StartClient router={router} />);
