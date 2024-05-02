"use client";

import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import CardDepositions from "./CardDepositions";

const Depositions = () => {
  const testimonials = [
    {
      id: 1,
      name: "Cristina Cavalcante",
      text: "Recebi a indicação de uma amiga e agora tenho orgulho de poder indicar também. A Dra Camila é uma excelente profissional, sempre atenciosa e cautelosa no atendimento e na indicação de tratamento. Só gratidão no meu coração ❤",
    },
    {
      id: 2,
      name: "Gabriel Yared",
      text: "Atendimento excelente da recepção à consulta. A Dra. Camila Neiva acolhe, escuta e orienta com muita humanidade e preocupação com o paciente, o que infelizmente não vemos em muitos profissionais da área. Recomendo o atendimento e já estou animado para o meu retorno!",
    },
    {
      id: 3,
      name: "Laura Cardoso",
      text: "Um lugar que tem um atendimento diferenciado, acolhedor e profissionais excelentes que tem o olhar humanizado pelos pacientes.",
    },
    {
      id: 4,
      name: "Bruno Prestes",
      text: "Atendimento de excelência. Uma ótima profissional. Recomendo.",
    },
    {
      id: 5,
      name: "Giuliana Martins",
      text: "A Dra Camila é uma profissional sem igual, um atendimento humanizado incrível, fora o espaço de atendimento que é super aconchegante, recomendo sem medo!",
    },
    {
      id: 6,
      name: "Ronaldo dos Santos",
      text: "Muito boa a consulta, bem explicativa e me deixou seguro.",
    },
    {
      id: 7,
      name: "Artur Lagoia",
      text: "O atendimento profissional foi excelente, acompanhado de uma ótima estrutura, o que me deu total confiança para continuar o meu tratamento e recomendar para outras pessoas o consultório Dra. Camila Neiva.",
    },
    {
      id: 8,
      name: "Suellen Trindade",
      text: "Excelente profissional! Escuta sensível, postura acolhedora que faz toda a diferença para quem está em sofrimento psíquico.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  function prevSlide() {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }

  function nextSlide() {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }

  function goToSlide(slideIndex: number) {
    setCurrentIndex(slideIndex);
  }

  return (
    <div id="depoimentos" className="group my-8 md:my-12 lg:my-16">
      <div className="w-full">
        <h2 className="text-xl md:text-3xl font-bold text-center text-[#CDBCA8] uppercase">
          O que as pessoas dizem sobre o
        </h2>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-[#003E53] uppercase underline decoration-[#7C5A12] underline-offset-8">
          nosso atendimento
        </h2>
      </div>

      <div className="w-full m-auto py-4 relative flex justify-center items-center">
        <div className="w-5/6 h-full rounded-2xl bg-center bg-cover duration-500">
          <CardDepositions
            key={testimonials[currentIndex].id}
            depText={testimonials[currentIndex].text}
            depName={testimonials[currentIndex].name}
          />
        </div>

        {/* Left Arrow */}
        <div className="absolute top-[40%] -translate-x-0 translate-y-[50%] left-0 md:left-0 lg:left-64 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactLeft onClick={prevSlide} size={30} />
        </div>
        {/* Right Arrow */}
        <div className="absolute top-[40%] -translate-x-0 translate-y-[50%] right-0 md:right-0 lg:right-64 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactRight onClick={nextSlide} size={30} />
        </div>
      </div>

      <div className="flex top-4 justify-center py-2">
        {testimonials.map((slide, slideIndex) => (
          <div
            key={slide.id}
            onClick={() => goToSlide(slideIndex)}
            className="text-2xl cursor-pointer"
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Depositions;
