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
import Treatment from "@/components/Treatment";
import Head from "next/head";
import { GoogleTagManager } from "@next/third-parties/google";
import CookieNotice from "@/components/CookieNotice";

export default function Home() {
  return (
    <>
      <GoogleTagManager gtmId="GTM-KMRWN8G3" />
      <Head>
        <title>Dra. Carmila Neiva - Médica Psiquiatra em Macapá</title>
        <meta
          name="description"
          content="Estou aqui para ouvir suas preocupações e junto com você buscar maneiras de melhorar sua saúde mental e reencontrar sua paz e bem-estar. Vamos juntos definir o melhor plano de tratamento para você, seja ele com terapia, mudanças no estilo de vida, medicamentos ou uma combinação deles."
          key="desc"
        />
      </Head>
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
