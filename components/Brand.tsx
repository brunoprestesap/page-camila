import Image from "next/image";
import React from "react";

const Brand = () => {
  return (
    <div id="brand" className="relative w-full">
      <Image
        className="w-full h-screen object-cover object-top"
        width={3232}
        height={4774}
        src="/assets/brand.jpg"
        alt="brand background"
      />

      <div className="w-full h-screen absolute top-0 left-0 md:bottom-4 bg-white/50">
        <div
          id="sobre"
          className="flex justify-center absolute bottom-10 left-0 md:w-5/6 lg:max-w-[600px] px-5"
        >
          <div className="backdrop-opacity-10 rounded-2xl bg-white px-5 py-8 bg-opacity-60 shadow-2xl shadow-stone-500/50">
            <div className="flex gap-2">
              <h2 className="text-2xl md:text-4xl tracking-widest text-[#CDBCA8] font-extrabold">
                QUEM
              </h2>
              <h2 className="text-2xl md:text-4xl font-bold mb-5 underline decoration-[#7C5A12] underline-offset-8">
                SOU EU
              </h2>
            </div>
            <h2 className="text-base md:text-xl md:leading-8 text-justify text-black">
              Tenho 38 anos, sou goiana de coração, médica formada pela
              Universidade Federal do Amapá. Cursei pós-graduação em Psiquiatria
              pelo Albert Einstein do RJ e Psiquiatria Intervencionista pelo
              HC-USP. Além disso, fiz Enfermagem e Mestrado pela UNICAMP.
              Trabalho desde 2019 ajudando pessoas a encontrar equilíbrio e
              tranquilidade emocional. Já trabalhei também em CAPS infantil,
              CAPS Álcool e drogas e Clínica de Reabilitação. Prezo pelo
              atendimento responsável e humanizado e será uma grande satisfação
              atender você e poder te ajudar também.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;
