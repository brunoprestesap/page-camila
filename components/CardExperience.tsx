import React from "react";

const CardExperience = () => {
  return (
    <div className="w-full mx-auto group shadow-2xl rounded-bl-2xl transform duration-500 hover:-translate-y-2 bg-[#003E53] text-stone-700 p-4 lg:py-8 lg:px-5">
      <h2 className="text-[#CDBCA8]  text-xl lg:text-3xl uppercase">
        Experiência
      </h2>

      <div className="flex justify-between items-center mt-8 border-l-4 pl-2 border-l-[#7C5A12]">
        <h2 className="text-white text-2xl lg:text-5xl">4+</h2>
        <h2 className="text-white text-sm lg:text-xl text-right">
          Anos de
          <br />
          experiência
        </h2>
      </div>

      <div className="flex justify-between items-center mt-4 border-l-4 pl-2 border-l-[#7C5A12]">
        <h2 className="text-white text-2xl lg:text-5xl">2K+</h2>
        <h2 className="text-white text-sm lg:text-xl text-right">
          Pacientes
          <br />
          atendidos
        </h2>
      </div>
    </div>
  );
};

export default CardExperience;
