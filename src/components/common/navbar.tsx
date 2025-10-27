"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import Image from "next/image";
import Link from "next/link";

const BASE_URL = "https://circlepv.com";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", url: `${BASE_URL}/` },
    { name: "About us", url: `${BASE_URL}/about` },
    { name: "Our Solution", url: `${BASE_URL}/solution` },
    { name: "Our Partners", url: `${BASE_URL}/partners` },
    { name: "Panel Donation", url: `${BASE_URL}/donation` },
    { name: "Recycle Worth Calculator", url: `/calculator` },
    { name: "Sustainability & ESG Impact", url: `${BASE_URL}/esgbenefits` },
  ];

  return (
    <div className="flex items-center justify-between py-6 lg:py-10 bg-primary px-10 lg:px-24 w-full relative">
      <Link href={`${BASE_URL}/`} className="">
        <Image src={logo} className="h-[40px] w-[130px] lg:h-[60px]" alt="Logo" />
      </Link>

      <div className="hidden lg:flex flex-row items-center gap-x-4">
        {links.map((link) => (
          <Link key={link.name} className="text-white text-md" href={link.url}>
            {link.name}
          </Link>
        ))}
        <Link href={`${BASE_URL}/contact`} className="w-[130px] bg-secondary p-2 uppercase text-white hover:bg-primary">
          Get in touch
        </Link>
        <Link href={`${BASE_URL}/register`} className="w-[130px] text-center bg-secondary p-2 uppercase text-white hover:bg-primary">
          Register
        </Link>
      </div>

      <button
        className="lg:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-primary flex flex-col items-center gap-y-4 py-5 lg:hidden shadow-md">
          {links.map((link) => (
            <Link
              key={link.name}
              className="text-white text-lg font-bold"
              href={link.url}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={`${BASE_URL}/contact`}
            className="bg-secondary px-4 py-2 uppercase text-white"
            onClick={() => setIsOpen(false)}
          >
            Get in touch
          </Link>
          <Link
            href={`${BASE_URL}/register`}
            className="bg-secondary px-4 py-2 uppercase text-white"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};
