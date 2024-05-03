import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dra Camila Neiva - Psiquiatra",
  description: "Médica Psiquiatra",
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
