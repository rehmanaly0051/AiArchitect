"use client";
import React from "react";
import Image from "next/image";
//import { Button } from "./ui/button";
import InteractiveHoverButton from "./ui/interactive-hover-button";
//import LinK from "next/link";

function Banner() {
  return (
    <div className="relative w-full h-screen border-white">
      <Image
        className="object-cover sm:p-5"
        src="/ai11.jpg"
        alt="Image not found"
        layout="fill" // Makes the image fill its parent container
        priority
        // Ensures the image loads quickly for the header
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center space-y-3">
        <p className="text-7xl font-bold">Transform Your Vision into Reality</p>
        <p className="text-2xl">
          Intelligent Home Designs and Inspiring Interiors
        </p>
        <InteractiveHoverButton
          text="Generate🪄"
          className="w-[100%] text-black"
          onClick={() => (window.location.href = "/GetStarted")}
        ></InteractiveHoverButton>
      </div>
    </div>
  );
}

export default Banner;
