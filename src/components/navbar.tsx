"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
function Navbar() {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(menu == true ? false : true);
  };

  return (
    <>
      <nav className="p-5 flex items-center md:justify-between justify-between mx-auto absolute top-0 left-0 w-full z-10 bg-transparent">
        <div className="hidden md:flex items-center bg-white gap-1 pt-2 pb-3 pl-3 pr-3 rounded-br-3xl">
          <Link href="/" className="font-bold text-xl mr-2 text-black">
            Ai Architect
          </Link>
          <Link
            href="/"
            className="hover:text-white hover:bg-black rounded-full pt-3 pb-3 pl-5 pr-5"
          >
            Home
          </Link>
          <Link
            href="/AboutUs"
            className="hover:text-white hover:bg-black rounded-full pt-3 pb-3 pl-5 pr-5"
          >
            About
          </Link>
          <Link
            href="/FAQ"
            className="hover:text-white hover:bg-black rounded-full pt-3 pb-3 pl-5 pr-5"
          >
            FAQ&#39;s
          </Link>
          <Link
            href="/GetStarted"
            className="hover:text-white hover:bg-black rounded-full pt-3 pb-3 pl-5 pr-5"
          >
            Get Started
          </Link>
        </div>
        <div className="sm:block hidden">
          <Button className="bg-white text-black rounded-2xl hover:bg-black hover:text-white hover:shadow-2xl mr-5">
            <Link href="/signup">Register</Link>
          </Button>
          <Button className="bg-white text-black rounded-2xl hover:bg-black hover:text-white hover:shadow-2xl mr-10">
            <Link href="/login">Log In</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          <Image src="/icons8-menu-50.png" alt="Menu" width={30} height={30} />
        </button>
      </nav>
      {/*mobile navbar*/}
      {menu && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-8 p-5 md:hidden">
          <button className="self-end mb-5" onClick={toggleMenu}>
            <Image
              src="/icons8-close-window-50.png"
              alt="Close Menu"
              width={50}
              height={50}
            />
          </button>
          <Link
            href="/"
            className="text-xl hover:text-gray-500"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/AboutUs"
            className="text-xl hover:text-gray-500"
            onClick={toggleMenu}
          >
            About Us
          </Link>
          <Link
            href="/FAQ"
            className="text-xl hover:text-gray-500"
            onClick={toggleMenu}
          >
            FAQ&#39;s
          </Link>
          <Link
            href="/GetStarted"
            className="text-xl hover:text-gray-500"
            onClick={toggleMenu}
          >
            Get Started
          </Link>
          <div className="flex justify-center items-center gap-5">
            <Button className="bg-white text-black rounded-2xl hover:bg-black hover:text-white hover:shadow-2xl">
              Register
            </Button>
            <Button className="bg-white text-black rounded-2xl hover:bg-black hover:text-white hover:shadow-2xl">
              Log In
            </Button>
          </div>
          <button onClick={toggleMenu}></button>
        </div>
      )}
    </>
  );
}

export default Navbar;
