// app.config.ts
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
    server: {
        experimental: {
            websocket: true
        }
    }
})
