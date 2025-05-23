// app/routes/__root.tsx
import { createRootRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";

export const Route = createRootRoute({
	scrollRestoration: true,
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Headstart Example",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<Meta />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
