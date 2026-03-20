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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#171717" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
