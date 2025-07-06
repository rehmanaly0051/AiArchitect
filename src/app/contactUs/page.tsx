import Footer from "@/components/footer";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "@/components/navbar";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
function contactUs() {
  return (
    <main className="">
      <div className="sm:p-5 ">
        <Navbar />
        <div className="bg-black h-96 flex items-center justify-center flex-col bg-[url('/ai-12.jpg')] bg-cover bg-center bg-no-repeat">
          <h1 className="text-white text-5xl font-bold">Contact Us</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-white hover:text-gray-400"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold">
                  Contact Us
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex justify-evenly items-center bg-black px-20 py-20 gap-20 text-white">
        <div className="space-y-4">
          <p className="text-6xl">Get In Touch</p>
          <p>
            You can contact us with our email directly or just through your
            message here.
          </p>
          <div className="border-b-2">
            <p>Contact Us:</p>
            <p>+92 320 267267 5</p>
            <p className="pb-10">AI-ArchitectOffical@gmail.com</p>
          </div>
          <p>Follow us:</p>
          <div className="flex gap-5">
            <FontAwesomeIcon icon={faFacebook} className="w-7" />
            <FontAwesomeIcon icon={faInstagram} className="w-7" />
            <FontAwesomeIcon icon={faTwitter} className="w-7" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Send a Message
          </h2>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              className="p-3 w-64 border-t-0 border-r-0 border-l-0"
            />
            <Input
              placeholder="Email Address"
              className="w-full p-3 border-t-0 border-r-0 border-l-0 "
            />
            <Textarea
              placeholder="Message"
              className="w-full p-3 border-t-0 border-r-0 border-l-0"
            />
            <Button className="bg-[#121d19] text-white py-3 w-full rounded-md hover:bg-black transition-all">
              Submit
            </Button>
          </div>
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d27230.319469509937!2d74.24573439999999!3d31.447449600000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1737465439235!5m2!1sen!2s"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      ></iframe>
      <Footer />
    </main>
  );
}

export default contactUs;
