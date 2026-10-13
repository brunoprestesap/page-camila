import { sendGTMEvent } from "@next/third-parties/google";
import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

interface Props {
  pbottom?: boolean;
}

const BtnWhats = ({ pbottom }: Props) => {
  return (
    <div
      className={`fixed right-4 ${pbottom ? "bottom-4" : "bottom-20"}`}
      style={{ zIndex: "1000" }}
    >
      <Link
        href="https://wa.me/5596991354590?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Dra.%20Camila%20e%20gostaria%20de%20agendar%20uma%20consulta."
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          sendGTMEvent({ event: "buttonClicked", value: "whatsapp" })
        }
        className="bg-[#03C988] text-2xl p-4 rounded-full text-white hover:drop-shadow-xl flex flex-col items-center justify-center gap-2"
      >
        <FaWhatsapp />
        <span className="text-white text-xs">Whatsapp</span>
      </Link>
    </div>
  );
};

export default BtnWhats;
