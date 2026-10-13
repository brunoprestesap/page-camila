import Apresentation from "@/components/Apresentation";
import Brand from "@/components/Brand";
import BtnUp from "@/components/BtnUp";
import Contact from "@/components/Contact";
import ContentsVideo from "@/components/ContentsVideo";
import Depositions from "@/components/Depositions";
import Diferentials from "@/components/Diferentials";
import Footer from "@/components/Footer";
import FormCta from "@/components/FormCta";
import Hero from "@/components/Hero";
import MetaPixel from "@/components/MetaPixel";
import Treatment from "@/components/Treatment";
import type { Metadata } from "next";
import { openGraphBase } from "./shared-metadata";

const title = "Dra. Camila Neiva - Médica Psiquiatra em Macapá";
const description =
  "Estou aqui para ouvir suas preocupações e junto com você buscar maneiras de melhorar sua saúde mental e reencontrar sua paz e bem-estar. Vamos juntos definir o melhor plano de tratamento para você, seja ele com terapia, mudanças no estilo de vida, medicamentos ou uma combinação deles.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { ...openGraphBase, title, description, url: "/" },
};

export default function Home() {
  return (
    <>
      <MetaPixel />
      {/* GTM pausado. Para reativar: <GoogleTagManager gtmId="GTM-KMRWN8G3" />, importado de "@next/third-parties/google" */}
      <BtnUp />
      <Hero />
      <Treatment />
      <Diferentials />
      <Apresentation />
      <Depositions />
      <Brand />
      <ContentsVideo />
      <FormCta />
      <Contact />
      <Footer />
    </>
  );
}
