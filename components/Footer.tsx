import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaHeadset,
  FaHospital,
  FaMailBulk,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="footer" className="bg-[#003E53] p-5 md:p-12">
      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Column One */}
        <div className="w-full">
          {/* Logo div */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/assets/logo.png"
              className="w-5/6 mb-5"
              alt="logo"
              width={1080}
              height={199}
            />
          </div>

          {/* Social Netowrks Section */}
          <div className="w-full">
            <h2 className="text-xl font-bold text-[#CDBCA8] uppercase">
              Redes Sociais
            </h2>
            <div className="flex gap-3 my-3">
              <div>
                <Link
                  href="https://www.instagram.com/camilaneiva.dra/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1"
                  id="instagram"
                >
                  <FaInstagram
                    aria-labelledby="instagram"
                    color="white"
                    size={25}
                  />
                </Link>
              </div>
              <div>
                <Link
                  href="https://www.facebook.com/camilaneiva.psiquiatra"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1"
                  id="facebook"
                >
                  <FaFacebookF
                    aria-labelledby="facebook"
                    color="white"
                    size={25}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="w-full my-5">
            <div className="flex my-5">
              <h2 className="text-xl font-bold text-[#CDBCA8]">
                PSIQUIATRA MACAPÁ - DRA CAMILA NEIVA
              </h2>
            </div>
            <div className="flex gap-3 items-center mb-3">
              <FaHeadset size={30} color="CDBCA8" />
              <h2 className="lining-nums text-xl text-white subpixel-antialiased">
                (96) 99135-4590
              </h2>{" "}
            </div>
            <div className="flex gap-3 items-center mb-3">
              <FaHospital size={30} color="CDBCA8" />
              <h2 className="text-base text-white lining-nums">
                Instituto AMPARO - Av. Ataíde Teive, 1217, 1º Andar, Sala nº 3 -
                Centro, Macapá - Amapá CEP: 68900-095
              </h2>
            </div>
            <div className="flex gap-3 items-center mb-3">
              <FaMailBulk size={30} color="CDBCA8" />
              <h2 className="text-base text-white">
                clinicadracamilaneiva@gmail.com
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation section */}
        <div>
          <h2 className="text-xl font-bold text-[#CDBCA8] uppercase">MENU</h2>
          <Link href="#hero">
            <h2 className="text-base my-2 mx-3 text-white">Home</h2>
          </Link>
          <Link href="#sobre">
            <h2 className="text-base my-2 mx-3 text-white">Sobre</h2>
          </Link>
          <Link href="#tratamentos">
            <h2 className="text-base my-2 mx-3 text-white">Tratamentos</h2>
          </Link>
          <Link href="#depoimentos">
            <h2 className="text-base my-2 mx-3 text-white">Depoimentos</h2>
          </Link>
          <Link href="#diferenciais">
            <h2 className="text-base my-2 mx-3 text-white">Diferenciais</h2>
          </Link>
          <Link href="#conteudos">
            <h2 className="text-base my-2 mx-3 text-white">Conteúdos</h2>
          </Link>
          <Link href="#contact">
            <h2 className="text-base my-2 mx-3 text-white">Localização</h2>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
