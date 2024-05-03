import Link from "next/link";
import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div id="contact" className="my-8">
      <div className="flex justify-center gap-3 mb-8">
        <h2 className="flex gap-2 text-4xl font-bold text-center text-[#CDBCA8]">
          <FaMapMarkedAlt color="003E53" />
          ONDE
        </h2>
        <h2 className="text-4xl font-bold text-center text-[#003E53] underline decoration-[#7C5A12] underline-offset-8">
          ESTAMOS
        </h2>
      </div>

      <div className="mx-5 flex flex-col md:flex-row items-start justify-center">
        <div className="flex flex-col w-full">
          <div className="w-full flex justify-center">
            <Link
              href="https://www.google.com/maps/place/Psiquiatra+em+Macap%C3%A1+-+Dra.+Camila+Neiva/@0.0305236,-51.0658788,17z/data=!3m1!4b1!4m6!3m5!1s0x8d61e10bcf1b86ed:0x6f027f4a0e7e4563!8m2!3d0.0305182!4d-51.0633039!16s%2Fg%2F11tdr4qpss?entry=ttu"
              target="_blank"
              rel="noreferrer"
            >
              <button
                title="Ir para rotas"
                className="bg-[#003E53] rounded-lg w-full py-3 px-8 mb-5 text-center hover:border hover:border-stone-100 hover:shadow-xl"
              >
                <h2 className="text-white uppercase font-bold">Traçar rotas</h2>
              </button>
            </Link>
          </div>
          <div className="w-full shadow-2xl shadow-stone-500/50">
            <iframe
              className="w-full rounded-xl"
              title="Onde eu atendo"
              width="600"
              height="615"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8177541712066!2d-51.06587882426687!3d0.030523564393975137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d61e10bcf1b86ed%3A0x6f027f4a0e7e4563!2sPsiquiatra%20em%20Macap%C3%A1%20-%20Dra.%20Camila%20Neiva!5e0!3m2!1spt-BR!2sbr!4v1690810492556!5m2!1spt-BR!2sbr"
            ></iframe>
          </div>
        </div>

        <div className="w-full px-5 my-5 md:my-0">
          <div className="w-full mb-8 flex justify-center items-center">
            <h1 className="text-4xl font-bold text-center text-[#003E53] underline decoration-[#7C5A12] underline-offset-8">
              CONTATO
            </h1>
          </div>

          <div className="w-full p-5 bg-[#CDBCA8] shadow-2xl shadow-stone-500/50 rounded-xl">
            <form
              action="https://getform.io/f/73cd82b3-0511-4dc0-845b-0c8a5b07ca19"
              method="POST"
              encType="multipart/form-data"
            >
              <div className="grid md:grid-cols-2 gap-2 w-full">
                <div className="flex flex-col">
                  <label
                    id="name_label"
                    className="text-sm py-2 text-black font-medium"
                  >
                    Nome
                  </label>
                  <input
                    aria-labelledby="name_label"
                    className="rounded-lg p-1 flex border-[#003E53]-300 focus:ring focus:ring-[#003E53]"
                    type="text"
                    name="name"
                    id="name"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    id="phone_number"
                    className="text-sm py-2 text-black font-medium"
                  >
                    Telefone
                  </label>
                  <input
                    aria-labelledby="phone_number"
                    className="rounded-lg p-1 flex border-[#003E53]-300 focus:ring focus:ring-[#003E53]"
                    type="text"
                    name="phone"
                  />
                </div>
              </div>
              <div className="flex flex-col py-2">
                <label
                  id="email_label"
                  className="text-sm py-2 text-black font-medium"
                >
                  E-mail
                </label>
                <input
                  aria-labelledby="email_label"
                  className="rounded-lg p-1 flex border-[#003E53]-300 focus:ring focus:ring-[#003E53]"
                  type="email"
                  name="email"
                />
              </div>
              <div className="flex flex-col py-2">
                <label
                  id="textarea-label"
                  className="text-sm py-2 text-black font-medium"
                >
                  Mensagem
                </label>
                <textarea
                  aria-labelledby="textarea-label"
                  className="rounded-lg p-1 border-[#003E53]-300 focus:ring focus:ring-[#003E53]"
                  rows={5}
                  name="message"
                ></textarea>
              </div>
              <button
                title="Enviar Mensagem"
                className="bg-[#003E53] hover:bg-stone-700 text-gray-100 mt-4 w-full p-4 rounded-lg"
              >
                <h2 className="text-lg font-bold">Enviar mensagem</h2>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
