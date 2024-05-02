import React from "react";

interface Props {
  icon: any;
  title: string;
  text: string;
}

const CardBeneficios = ({ icon, title, text }: Props) => {
  return (
    <div className="mx-auto group shadow-2xl rounded-b-2xl transform duration-500 hover:-translate-y-2">
      <div className="p-5">
        <div className="flex justify-center">{icon}</div>
        <div className="w-full py-5">
          <h2 className="text-2xl font-bold text-center tracking-tight">
            {title}
          </h2>
          <p className="text-base mt-3 md:leading-7 text-stone-800 text-justify">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardBeneficios;
