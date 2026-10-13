import type { Metadata } from "next";

// Campos do Open Graph que valem para todas as páginas. Cada page.tsx que
// define o próprio `openGraph` precisa espalhar este objeto, porque o Next
// troca o `openGraph` do layout inteiro, sem mesclar os campos.
export const openGraphBase: NonNullable<Metadata["openGraph"]> = {
  siteName: "Dra. Camila Neiva",
  locale: "pt_BR",
  type: "website",
  images: [
    {
      url: "/assets/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Dra. Camila Neiva, médica psiquiatra em Macapá/AP, sentada numa poltrona, ao lado da logo e do texto: atendimento presencial e por telemedicina.",
    },
  ],
};
