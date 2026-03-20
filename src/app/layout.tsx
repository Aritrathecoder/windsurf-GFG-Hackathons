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
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNSAzNSBMIDM1IDM1IEwgNTUgNzUgTCA0MCA3NSBMIDI1IDQ1IEwgNSA0NSBaIiAvPgogIDxwYXRoIGQ9Ik0gNDAgMzUgTCA1NSAzNSBMIDc1IDc1IEwgNjAgNzUgWiIgLz4KICA8cGF0aCBkPSJNIDYwIDM1IEwgOTAgMzUgTCA4MCA1NSBMIDcwIDU1IFoiIC8+Cjwvc3ZnPg==" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#171717" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
