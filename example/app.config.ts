// app.config.ts
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
	tsr: {
		appDirectory: "app",
		autoCodeSplitting: true,
	},
	server: {
		preset: "bun",
		experimental: {
			websocket: true,
		},
	},
});
