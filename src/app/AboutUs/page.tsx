"use client";
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
function page() {
  const team_array = [
    {
      quote:
        "I am the Chief Executive Officer of AI Architect. we can make your dream house into reality",
      name: "Muhammad suleman",
      designation: "Chief Executive Officer of AI Architect",
      src: "/suleman.JPG",
    },
    {
      quote:
        "Hello, my name is Rehman ali, i am developer at Ai Architect. As a developer, I specialize in creating and optimizing solutions to bring ideas to life through technology. ",
      name: "Rehman Ali",
      designation: "Developer",
      src: "/rehman.jpg",
    },
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for. ",
      name: "Nooran Imran",
      designation: "Product Manager",
      src: "/nooran.jpg",
    },
  ];
  return (
    <main className="">
      <div className="sm:p-5 ">
        <Navbar />
        <div className="bg-black h-96 flex items-center justify-center flex-col bg-[url('/ai-12.jpg')] bg-cover bg-center bg-no-repeat">
          <h1 className="text-white text-5xl font-bold">About Us</h1>
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
                  About us
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="bg-black flex flex-wrap justify-evenly items-center text-white px-10 p-10 gap-20">
        {/* First Container: Image */}
        <div className="relative w-full md:w-1/2 max-w-lg aspect-[7/6] rounded-2xl overflow-hidden">
          <Image
            src="/map_ref.jpg"
            alt="Image not found"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Second Container: Text Content */}
        <div className="w-full md:w-1/2 max-w-lg">
          <p className="text-sm">About US</p>
          <p className="text-4xl font-bold mb-4">
            We always try to make user vision into reality.
          </p>
          <p className="leading-relaxed">
            AI Architect empowers everyone to create stunning and
            professional-looking home, landscape, and office floorplans and
            designs. Bring your dream space to life with ease, whether you’re an
            experienced designer or just starting out. Our smart AI-driven
            platform takes your input—such as dimensions, layout preferences,
            and room details—to generate precise 2D floor plans. Visualize your
            project in breathtaking 2D and 3D renderings, or take a Virtual
            Reality tour to experience it firsthand. We also provide a
            comprehensive interior design experience, complete with an
            AI-curated furniture list tailored to your style and needs. Unlock
            your creativity and learn new skills with AI Architect!
          </p>
        </div>

        <div className="md:w-1/2 max-w-lg">
          <p className="text-4xl font-bold mb-4">Our Story</p>
          <p>
            We started this project to help non-professionals visualize their
            future homes with simple tools. Coming from years of experience in
            design software development and architecture, we realized that not
            everybody could have the means to commission an agency or time to
            make proper research of who to hire.
          </p>
          <p>
            We managed to bring the functionality from the best industry design
            tools into our platform. In just a few years, we’ve grown from a
            small start-up with a few enthusiasts to a robust service with over
            64 millions of users and more than 300 million interior design
            projects created.
          </p>
          <p>
            Today we are a team of four. Our headquarters is in Pakistan, but
            you can use our service wherever you can get a good Internet
            connection, mobile device or laptop.
          </p>
        </div>
        <div className="relative w-full md:w-1/2 max-w-lg aspect-[7/6] rounded-2xl overflow-hidden">
          <Image
            src="/team.jpg"
            alt="Image not found"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      <p className="text-center text-5xl px-16 pt-10 font-bold">Our team</p>
      <AnimatedTestimonials testimonials={team_array} />
      <Footer />
    </main>
  );
}

export default page;
