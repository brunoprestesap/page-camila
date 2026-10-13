import type { Metadata } from "next";
import "./globals.css";
import { openGraphBase } from "./shared-metadata";

export const metadata: Metadata = {
  // Domínio oficial. Os links do Open Graph e o canonical saem completos a partir dele.
  metadataBase: new URL("https://dracamilaneiva.com.br"),
  title: "Dra Camila Neiva - Psiquiatra",
  description: "Médica Psiquiatra",
  openGraph: openGraphBase,
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
