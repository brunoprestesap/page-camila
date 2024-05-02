import React from "react";
import { FaStar, FaQuoteLeft, FaQuoteRight, FaGoogle } from "react-icons/fa";

interface Props {
  depText: string;
  depName: string;
}

const CardDepositions = ({ depText, depName }: Props) => {
  return (
    <div className="flex flex-wrap justify-center shadow-lg mx-auto max-w-3xl py-5 group transform duration-500 cursor-pointer">
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center gap-2 mb-3">
          <FaStar color="CDBCA8" />
          <FaStar color="CDBCA8" />
          <FaStar color="CDBCA8" />
          <FaStar color="CDBCA8" />
          <FaStar color="CDBCA8" />
        </div>
      </div>

      <div className="w-full">
        <div className="px-5">
          <div className="md:flex md:items-center md:gap-5">
            <FaQuoteLeft className="invisible md:visible" size={25} />
            <h2 className="text-justify leading-6 text-stone-900 text-base md:text-xl font-medium">
              {depText}
            </h2>
            <FaQuoteRight className="invisible md:visible" size={25} />
          </div>
          <div className="flex flex-row items-center font-medium my-5">
            <FaGoogle size={25} />
            <h2 className="text-sm md:text-lg font-bold ml-5 text-stone-900">
              {depName} - Google Locais
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDepositions;
