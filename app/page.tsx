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
import { GoogleTagManager } from "@next/third-parties/google";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dra. Carmila Neiva - Médica Psiquiatra em Macapá',
  description: "Estou aqui para ouvir suas preocupações e junto com você buscar maneiras de melhorar sua saúde mental e reencontrar sua paz e bem-estar. Vamos juntos definir o melhor plano de tratamento para você, seja ele com terapia, mudanças no estilo de vida, medicamentos ou uma combinação deles.",
}

export default function Home() {
  return (
    <>
      <MetaPixel />
      <GoogleTagManager gtmId="GTM-KMRWN8G3" />
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
