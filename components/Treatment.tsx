import React from "react";
import { FaFrownOpen, FaMehRollingEyes, FaSadTear } from "react-icons/fa";
import CardTreatment from "./CardTreatment";

const Treatment = () => {
  const contents = [
    {
      id: 1,
      icon: <FaSadTear size={50} />,
      title: "Depressão",
      text: "Se você está se sentindo triste, desanimado ou sem esperança, pode ser que esteja passando por um problema de depressão. Não deixe esses sentimentos tomarem conta da sua vida. O tratamento para depressão pode ajudá-lo a se sentir bem melhor e a recuperar sua qualidade de vida.",
    },
    {
      id: 2,
      icon: <FaFrownOpen size={50} />,
      title: "Ansiedade",
      text: "Falta de ar, sensação de desmaio, insônia, medo, sensação de que algo ruim está prestes a acontecer, irritabilidade e pensamentos ruins são sinais e sintomas graves de ansiedade. O mais importante é saber que ela é um problema que pode acontecer com todas as pessoas e que é possível tratar.",
    },
    {
      id: 3,
      icon: <FaMehRollingEyes size={50} />,
      title: "Insônia",
      text: "A insônia é uma doença que causar prejuízos importantes no seu dia a dia e na sua saúde em geral.  A pessoa com dificuldades para dormir pode apresentar sintomas associados à fadiga, dificuldades de concentração e memória, irritabilidade, alterações de humor e ansiedade. O tratamento para ansiedade começa pela adoção de hábitos e rotinas mais saudáveis.",
    },
  ];

  return (
    <div id="tratamentos" className="p-5 bg-[#CDBCA8]">
      <div className="my-12">
        <h2 className="text-4xl font-bold text-center uppercase text-white">
          Em que podemos
        </h2>
        <h2 className="text-4xl font-bold text-center uppercase underline decoration-[#7C5A12] underline-offset-8">
          te ajudar
        </h2>
      </div>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl">
          {contents.map((content) => {
            return (
              <CardTreatment
                key={content.id}
                icon={content.icon}
                title={content.title}
                text={content.text}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Treatment;
