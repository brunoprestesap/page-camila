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
        href="https://wa.me/5596991354590"
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          sendGTMEvent({ event: "buttonClicked", value: "whatsapp" })
        }
      >
        <button
          type="button"
          title="Whatsapp"
          // style={{ background: "#03C988", borderRadius: "50%" }}
          className="bg-[#03C988] text-2xl p-4 rounded-full text-white hover:drop-shadow-xl hover:bg-light-gray flex flex-col items-center justify-center gap-2"
        >
          <FaWhatsapp />
          <span className="text-white text-xs">Whatsapp</span>
        </button>
      </Link>
    </div>
  );
};

export default BtnWhats;
