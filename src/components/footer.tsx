import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#121d19] text-muted p-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start sm:border-r-2 ">
          <p className="text-5xl font-bold">AI Architect</p>
        </div>

        {/* Pages Section */}
        <div className="flex flex-col sm:items-start items-center sm:border-r-2">
          <ul className="text-white">
            <li className="mb-2 sm:mt-4">
              <Link href="/">Home</Link>
            </li>
            <li className="mb-2">
              <Link href="/AboutUs">About Us</Link>
            </li>
            <li className="mb-2">
              <Link href="/FAQ">FAQ's</Link>
            </li>
            <li className="mb-2">
              <Link href="/contactUs">ContactUs</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <p className="mb-2">G-5 River view cooperative housing society</p>
          <p className="mb-2">Lahore, punjab</p>
          <p className="mb-2">Email: AiArchitect@gmail.com</p>
          <p className="mb-2">Phone: +92 320 267267 5</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
