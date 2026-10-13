"use client";

import Link from "next/link";
import React, { useSyncExternalStore } from "react";
import BtnWhats from "./BtnWhats";

const STORAGE_KEY = "cookieAccepted";
const ACCEPTED_EVENT = "cookie-accepted";

// Vale até a página recarregar, para o aceite funcionar mesmo com o localStorage bloqueado.
let acceptedInMemory = false;

function subscribe(onChange: () => void) {
  window.addEventListener(ACCEPTED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ACCEPTED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  if (acceptedInMemory) return true;
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

// O HTML estático sai sempre com a barra visível.
function getServerSnapshot() {
  return false;
}

const CookieNotice = () => {
  const accepted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const acceptCookies = () => {
    acceptedInMemory = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage bloqueado: o aceite fica só na memória.
    }
    window.dispatchEvent(new Event(ACCEPTED_EVENT));
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
          <h2>
            Nosso site usa cookies para melhorar a navegação.{" "}
            <Link href="/politica-de-privacidade" className="underline">
              Saiba mais
            </Link>
          </h2>

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
