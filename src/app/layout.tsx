import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Windsurf — AI Assistant",
  description: "Next-gen AI assistant and code editor.",
  keywords: "ai, assistant, code editor, windsurf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA1MTIgMjk2IiBmaWxsPSIjZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik01MDcuMjggMC4xNDI2MjNINTAyLjRDNDc2LjcyMSAwLjEwMjYzIDQ1NS44ODIgMjAuODk5IDQ1NS44ODIgNDYuNTc0NVYxNTAuNDE2QzQ1NS44ODIgMTcxLjE1MyA0MzguNzQzIDE4Ny45NSA0MTguMzQ0IDE4Ny45NEM0MDYuMjI0IDE4Ny45NSAzOTQuMTI1IDE4MS44NTEgMzg2Ljk0NSAxNzEuNjEzTDI4MC44ODkgMjAuMTM5MUMyNzIuMDg5IDcuNTYxMzMgMjU3Ljc3IDAuMDYyNjM3MyAyNDIuMjcxIDAuMDYyNjM3M0MyMTguMDkxIDAuMDYyNjM3MyAxOTYuMzMyIDIwLjYxOTEgMTk2LjMzMiA0NS45OTQ2VjE1MC40MzZDMTk2LjMzMiAxNzEuMTczIDE3OS4zMzMgMTg3Ljk3IDE1OC43OTQgMTg3Ljk3QzE0Ni42MzQgMTg3Ljk3IDEzNC41NTUgMTgxLjg3MSAxMjcuMzc1IDE3MS42MzNMOC42OTk2NiAyLjEyMjI4QzYuMDE5NzYgLTEuNzE3MDUgMCAwLjE4MjYxNyAwIDQuODYxOFY5NS40MjZDMCAxMDAuMDA1IDEuMzk5OTUgMTA0LjQ0NCA0LjAxOTg0IDEwOC4yMDRMMTIwLjgxNSAyNzQuOTk1QzEyNy43MTUgMjg0Ljg1MyAxMzcuODk1IDI5Mi4xNzIgMTQ5LjYzNCAyOTQuODMxQzE3OS4wMTMgMzAxLjUxIDIwNi4wNTIgMjc4Ljg5NCAyMDYuMDUyIDI1MC4wNzlWMTQ1LjY5N0MyMDYuMDUyIDEyNC45NjEgMjIyLjg1MSAxMDguMTY0IDI0My41OSAxMDguMTY0SDI0My42NUMyNTYuMTUgMTA4LjE2NCAyNjcuODcgMTE0LjI2MyAyNzUuMDQ5IDEyNC41MDFMMzgxLjEyNSAyNzUuOTU1QzM4OS45NDUgMjg4LjU1MiA0MDMuNTI0IDI5Ni4wMzEgNDE5LjcyNCAyOTYuMDMxQzQ0NC40NDMgMjk2LjAzMSA0NjUuNjIyIDI3NS40NTUgNDY1LjYyMiAyNTAuMDk5VjE0NS42NzdDNDY1LjYyMiAxMjQuOTQxIDQ4Mi40MjEgMTA4LjE0NCA1MDMuMTYgMTA4LjE0NEg1MDcuM0M1MDkuOSAxMDguMTQ0IDUxMiAxMDYuMDQ0IDUxMiAxMDMuNDQ1VjQuODQxOEM1MTIgMi4yNDIyNiA1MDkuOSAwLjE0MjYyMyA1MDcuMyAwLjE0MjYyM0g1MDcuMjhaIiAvPgo8L3N2Zz4=" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#171717" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
