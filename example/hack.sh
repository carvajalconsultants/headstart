#!/bin/sh

CONTENT='--- nitro-dev.js	2025-02-08 19:24:12
+++ node_modules/vinxi/lib/nitro-dev.js	2025-02-08 19:54:14
@@ -293,26 +293,7 @@
 	// 	}),
 	// );

-	const adapter = wsAdapter({
-		...wsApp.websocket,
-		hooks: {
-			open: (event) => {
-				event.ctx.node.req.url = event.ctx.node.req.originalUrl;
-			},
-			message: (event) => {
-				event.ctx.node.req.url = event.ctx.node.req.originalUrl;
-			},
-			close: (event) => {
-				event.ctx.node.req.url = event.ctx.node.req.originalUrl;
-			},
-			error: (event) => {
-				event.ctx.node.req.url = event.ctx.node.req.originalUrl;
-			},
-			upgrade: (event) => {
-				// event.ctx.node.req.url = event.ctx.node.req.originalUrl;
-			},
-		},
-	});
+	const adapter = wsAdapter(wsApp.websocket);
 	// Listen
 	/** @type {import("@vinxi/listhen").Listener[]}  */
 	let listeners = [];
'

echo "$CONTENT" | patch -p0
