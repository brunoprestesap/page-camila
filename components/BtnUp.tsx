"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const BtnUp = () => {
  return (
    <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
      <button
        onClick={() =>
          sendGTMEvent({ event: "buttonClicked", value: "whatsappS" })
        }
        type="button"
        title="Whatsapp"
        // style={{ background: "#03C988", borderRadius: "50%" }}
        className="bg-[#03C988] rounded-full text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
      >
        <Link
          href="https://wa.me/5596991354590"
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp />
        </Link>
      </button>
    </div>
  );
};

export default BtnUp;
