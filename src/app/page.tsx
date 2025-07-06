//import Image from "next/image";
"use client";
import Banar from "@/components/banner";
import Home_details from "@/components/home_details";
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
//simport Link from "next/link";
export default function Home() {
  return (
    <div className="relative ">
      <Navbar />
      <Banar />
      <Home_details />
      <Footer />
    </div>
  );
}
