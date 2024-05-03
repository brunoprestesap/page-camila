import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const FormCta = () => {
  return (
    <div id="cta" className="flex justify-center m-5">
      <div className="flex flex-col w-full md:w-3/6 items-center shadow-2xl shadow-gray-500/50 bg-[#CDBCA8] rounded-xl p-5 md:p-8">
        <h2 className="text-base md:text-xl leading-7 text-justify text-slate-900">
          O acompanhamento psiquiátrico é uma das ferramentas do tratamento do
          sofrimento mental. Assim como o corpo, nossa mente também precisa de
          atenção. Agende sua consulta e juntos encontraremos o melhor plano de
          cuidados para você.
        </h2>

        <Link
          href="https://wa.me/5596991354590"
          target="_blank"
          rel="noreferrer"
        >
          <button
            title="Entrar em contato"
            className="p-3 md:p-5 w-80 my-5 text-white rounded-2xl transform duration-500 hover:-translate-y-1 bg-[#003E53]/70 hover:bg-[#003E53]/90"
          >
            <div className="flex justify-center items-center gap-3 md:gap-5">
              <FaWhatsapp size={30} />
              <h2 className="text-lg md:text-xl">Agende sua consulta</h2>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FormCta;
