import React from "react";
import { LayoutGrid } from "./ui/layout-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
function home_details() {
  const cards = [
    {
      id: 1,
      content: "card 1",
      thumbnail: "/sofa.jpg",
      className: "row-span-2",
    },
    {
      id: 2,
      content: "card 4",
      thumbnail: "/pink.jpeg",
      className: "col-span-2",
    },
    {
      id: 3,
      content: "card 3",
      className: "",
      thumbnail: "/im1.jpg",
    },
    {
      id: 4,
      content: "card 2",
      className: "",
      thumbnail: "/im2.jpg",
    },
  ];
  const How_card = [
    {
      id: 1,
      content: "card 1",
      thumbnail: "/im3.jpg",
      className: "row-span-2 col-span-3",
    },
  ];

  return (
    <main>
      <div className="flex flex-col lg:flex-row bg-black text-white px-20 py-20">
        {/* About Us Section */}
        <div className="flex-[1] flex flex-col justify-center lg:pr-10 space-y-2">
          <p className="text-sm text-gray-400">About Us</p>
          <p className="text-2xl font-bold">
            We always try to make user vision into reality.
          </p>
          <p className="text-sm text-gray-400">
            AI Architect empowers everyone to create stunning and
            professional-looking home, landscape, and office floorplans and
            designs
          </p>
          <div className="flex flex-wrap gap-8 pt-8">
            <div>
              <p className="text-2xl font-bold">255+</p>
              <p className="text-sm text-gray-400">2d floor plan's</p>
              <p className="text-2xl font-bold">255+</p>
              <p className="text-sm text-gray-400">house design's</p>
            </div>
            <div className="mb-10">
              <p className="text-2xl font-bold">255+</p>
              <p className="text-sm text-gray-400">interior decor's</p>
            </div>
          </div>
          <Button className="bg-white text-black hover:text-black hover:bg-white">
            <Link href="/AboutUs">Learn More</Link>
          </Button>
        </div>

        {/* Layout Grid Section */}
        <div className="flex-[3] justify-center items-center min-h-[80vh] lg:h-[calc(100vh-80px)] sm:block hidden">
          <LayoutGrid cards={cards} />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row bg-[#121d19] text-white pl-10 pr-20  py-20">
        {/* Layout Grid Section */}
        <div className="flex-[2] justify-center items-center min-h-[80vh] lg:h-[calc(100vh-80px)] sm:block hidden">
          <LayoutGrid cards={How_card} />
        </div>
        {/* About Us Section */}
        <div className="flex-[1] flex flex-col justify-center lg:pr-10 space-y-2">
          <p className="text-sm text-gray-400">How it Works</p>
          <p className="text-2xl font-bold">
            Your Questions, Answered – Quickly and Clearly!
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Could You Help Me Design a Project?
              </AccordionTrigger>
              <AccordionContent>
                Our Ai model can provide personalized design advice and help you
                bring your vision to life. If you're interested in learning more
                about our professional services, don't hesitate to contact us
                for more information. Thank you for choosing AI_Archiect, and
                please don't hesitate to reach out if you have any questions or
                need further assistance. We're always here to help.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                I can't log in to my account. What should I do?
              </AccordionTrigger>
              <AccordionContent>
                If you've forgotten your password, don't worry! You can easily
                restore it by following these simple steps:
                <li>
                  Enter the email address associated with your Ai Architect
                  account.
                </li>
                <li>
                  Wait for an email with your new password to arrive in your
                  inbox. This may take up to 5 minutes. If you don't see it,
                  please check your spam folder.
                </li>
                <li>Log in to your account with the new password provided.</li>
                <li>Set a new password that you can easily remember.</li>
                If you're having trouble restoring your password using these
                steps, please don't hesitate to contact our Support team for
                assistance. We're here to help you!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                here can I find the language settings?
              </AccordionTrigger>
              <AccordionContent>
                Since Ai Architect is available on five platforms worldwide, we
                are constantly increasing the number of languages you can choose
                for the app's interface.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button className="bg-white text-black hover:text-black hover:bg-white">
            <Link href="/FAQ">Learn more</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto relative bg-black text-white">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center leading-loose">
          <p className="md:text-4xl text-2xl font-bold">
            Subscribe Our Newsletter
          </p>
          <p className="font-extralight">
            Get the latest information and promo offers directly
          </p>
          <div className="flex justify-center w-96 mx-auto mt-5">
            <Input placeholder="Enter your email" className="mr-2" />
            <Button className="bg-white text-black">Get Started</Button>
          </div>
        </div>
        <div className="p-20 flex justify-center">
          <p className="md:text-9xl text-5xl font-bold text-center text-[#121d19]">
            Newsletter
          </p>
        </div>
      </div>
    </main>
  );
}

export default home_details;
