"use client";

import React, { useEffect, useState } from "react";
import BtnWhats from "./BtnWhats";

const CookieNotice = () => {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookieAccepted");
    if (hasAccepted) {
      setAccepted(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieAccepted", "true");
    setAccepted(true);
  };

  if (accepted) {
    return <BtnWhats pbottom />;
  }

  return (
    <>
      <BtnWhats />
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#003E53] text-[#ffffff] p-3 text-center"
        style={{ zIndex: "1000" }}
      >
        <div className="flex flex-row items-center justify-center gap-4">
          <h2>Nosso site usa cookies para melhorar a navegação.</h2>

          <button
            onClick={acceptCookies}
            className="border border-[#9ab9c4] p-2 rounded-lg"
          >
            Aceitar
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieNotice;
