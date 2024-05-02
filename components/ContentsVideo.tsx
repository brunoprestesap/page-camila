"use client";

import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import VideoPlayer from "./VideoPlayer";

const ContentsVideo = () => {
  const contents = [
    {
      id: "1",
      videoId: "/assets/videos/depressao.mp4",
      poster: "/assets/capa/capa_depressao.jpg",
    },
    {
      id: "2",
      videoId: "/assets/videos/depressao-coisa-seria.mp4",
      poster: "/assets/capa/depressao_falta_deus.jpg",
    },
    {
      id: "3",
      videoId: "/assets/videos/depressao_.mp4",
      poster: "/assets/capa/depressao_capa.jpg",
    },
    {
      id: "4",
      videoId: "/assets/videos/cansaco_mental.mp4",
      poster: "/assets/capa/capa_casanco.jpg",
    },
  ];

  function prevSlide() {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? contents.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }

  function nextSlide() {
    const isLastSlide = currentIndex === contents.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }

  function goToSlide(slideIndex: number) {
    setCurrentIndex(slideIndex);
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div
      id="depoimentos"
      className="m-8 flex justify-center flex-col items-center"
    >
      {/* Title div */}
      <div className="flex justify-center gap-2 mb-3">
        <h2 className="text-4xl font-bold text-center uppercase text-[#CDBCA8]">
          Meus
        </h2>
        <h2 className="text-4xl font-bold text-center uppercase underline decoration-[#7C5A12] underline-offset-8">
          conteúdos
        </h2>
      </div>

      {/* Div do Video */}
      <div className="w-full md:w-[350px] relative flex justify-center">
        <div className="w-full md:w-6/6 object-cover duration-500">
          <VideoPlayer
            id={contents[currentIndex].id}
            videoId={contents[currentIndex].videoId}
            poster={contents[currentIndex].poster}
          />
        </div>

        {/* Left Arrow */}
        <div className="absolute top-[40%] -translate-x-0 translate-y-[50%] left-1 rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactLeft onClick={prevSlide} size={30} />
        </div>
        {/* Right Arrow */}
        <div className="absolute top-[40%] -translate-x-0 translate-y-[50%] right-1  text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactRight onClick={nextSlide} size={30} />
        </div>
      </div>

      <div className="flex top-4 justify-center py-2">
        {contents.map((slide, slideIndex) => (
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

export default ContentsVideo;
