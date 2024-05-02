import Apresentation from "@/components/Apresentation";
import Brand from "@/components/Brand";
import Contact from "@/components/Contact";
import ContentsVideo from "@/components/ContentsVideo";
import Depositions from "@/components/Depositions";
import Diferentials from "@/components/Diferentials";
import Footer from "@/components/Footer";
import FormCta from "@/components/FormCta";
import Hero from "@/components/Hero";
import Treatment from "@/components/Treatment";

export default function Home() {
  return (
    <>
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
