import Image from "next/image";
import React from "react";

const Apresentation = () => {
  return (
    <div className="w-full flex justify-center items-center md:my-8">
      <div className="w-full md:h-4/6 md:w-5/6 xl:w-4/6 md:flex md:items-center bg-white p-5 md:shadow-xl md:shadow-gray-500/50 md:backdrop-blur-sm rounded-xl">
        <div className="w-full md:flex justify-center">
          <Image
            className="w-full"
            src="/assets/logoNude.png"
            alt="logo amparo"
            width={1079}
            height={212}
          />
        </div>
        <div className="my-5 md:w-4/6 md:mx-8">
          <h2 className="text-base lg:text-xl text-stone-900 font-medium text-justify">
            Estou aqui para ouvir suas preocupações e junto com você buscar
            maneiras de melhorar sua saúde mental e reencontrar sua paz e
            bem-estar. Vamos juntos definir o melhor plano de tratamento para
            você, seja ele com terapia, mudanças no estilo de vida, medicamentos
            ou uma combinação deles.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Apresentation;
