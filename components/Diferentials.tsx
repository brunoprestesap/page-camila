import React from "react";
import { FaClock, FaHandHoldingHeart, FaUserMd } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import CardBeneficios from "./CardBeneficios";

const Diferentials = () => {
  const contents = [
    {
      icon: <FaHandHoldingHeart size={50} color="CDBCA8" />,
      title: "Atendimento humanizado ",
      text: "Fazemos questão de uma escuta atenta e humanizada. Prezamos pelo cuidado e humanização nos atendimentos por meio de um atendimento acolhedor. Atuamos com base na ética, empatia e respeito pela vida, com objetivo de melhorar cada vez mais sua qualidade de vida.",
    },
    {
      icon: <MdFamilyRestroom size={50} color="CDBCA8" />,
      title: "Acolhimento familiar",
      text: "Um diferencial que marca nosso atendimento é o espaço concedido aos familiares. O propósito da melhora integral do paciente inclui disponibilidade, acesso ao familiar para esclarecimento de dúvidas e participação no tratamento, respeitando as individualidades da pessoa e seguindo o sigilo médico.",
    },
    {
      icon: <FaClock size={50} color="CDBCA8" />,
      title: "Hora Marcada",
      text: "As consultas são realizadas por hora marcada, seja na modalidade de atendimento presencial ou por telemedicina. Em cada encontro, a pessoa tem seu espaço garantido para relatar suas dificuldades, sofrimento e angústias, respeitando seu sigilo.",
    },
    {
      icon: <FaUserMd size={50} color="CDBCA8" />,
      title: "Telemedicina",
      text: "Graças ao avanço das tecnologias, a telemedicina ajuda milhares de pessoas a buscar tratamento para os diversos tipos de transtornos. É possível atender pessoas que residem em outros estados e em outros países, devido a facilidade dos encontros por meio das vídeochamadas e também pela possibilidade do envio de receitas digitais. A sensação é de estar presente junto ao médico, como numa consulta presencial.",
    },
  ];
  return (
    <section id="diferenciais" className="px-5 py-16">
      <div className="flex w-full justify-center items-center gap-2">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#CDBCA8] uppercase">
          Nossos
        </h2>
        <h2 className="text-3xl md:text-4xl font-bold text-center uppercase underline decoration-[#7C5A12] underline-offset-8">
          diferenciais
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-5 pt-5">
        {contents.map((content, idx) => {
          return (
            <CardBeneficios
              key={idx}
              icon={content.icon}
              title={content.title}
              text={content.text}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Diferentials;
