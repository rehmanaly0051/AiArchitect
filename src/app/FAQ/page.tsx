import Footer from "@/components/footer";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
function faqs() {
  return (
    <main className="">
      <div className="sm:p-5 ">
        <Navbar />
        <div className="bg-black h-96 flex items-center justify-center flex-col bg-[url('/faq.jpg')] bg-cover bg-center bg-no-repeat">
          <h1 className="text-white text-5xl font-bold">FAQ&apos;s</h1>
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
                  FAQ&apos;s
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="bg-black text-white px-64 p-20">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Could You Help Me Design a Project?
            </AccordionTrigger>
            <AccordionContent>
              Our Ai model can provide personalized design advice and help you
              bring your vision to life. If you&apos;re interested in learning
              more about our professional services, don&apos;t hesitate to
              contact us for more information. Thank you for choosing
              AI_Archiect, and please don&apos;t hesitate to reach out if you
              have any questions or need further assistance. We&apos;re always
              here to help.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              I can&apos;t log in to my account. What should I do?
            </AccordionTrigger>
            <AccordionContent>
              If you&apos;ve forgotten your password, don&apos;t worry! You can
              easily restore it by following these simple steps:
              <li>
                Enter the email address associated with your Ai Architect
                account.
              </li>
              <li>
                Wait for an email with your new password to arrive in your
                inbox. This may take up to 5 minutes. If you don&apos;t see it,
                please check your spam folder.
              </li>
              <li>Log in to your account with the new password provided.</li>
              <li>Set a new password that you can easily remember.</li>
              If you&apos;re having trouble restoring your password using these
              steps, please don&apos;t hesitate to contact our Support team for
              assistance. We&apos;re here to help you!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What if I accidentally deleted the project?
            </AccordionTrigger>
            <AccordionContent>
              It is not possible to delete the project on any platform. You can
              only archive it. The good news is that after the project has been
              archived, you can quickly restore it! Here&apos;s what needs to be
              done:
              <li>
                Sign in to your account on the Web platform; You will need to
                use the same credentials (email-password or social networks) as
                you use to log in to other platforms.
              </li>
              <li>
                You&apos;ll get to the main screen with all your active projects
                listed. On the left-hand side of the screen you can see a menu.
                Find an Archive section and click it;
              </li>
              <li>
                You&apos;ve accessed the list of archived projects. Use the
                three dots at the corner of the project icon and use the Restore
                function;
              </li>
              <li>
                Your restored project will become available on all platforms
                you&apos;re using.
              </li>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How does the Design Battle work?
            </AccordionTrigger>
            <AccordionContent>
              You have six days to submit your work. The voting stage starts on
              the third day of the battle, but you can still submit your work,
              so take your time! Results are published the following week. You
              are the one to decide which project wins the battle. Join the
              voting to evaluate other works.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Where can I find the language settings?
            </AccordionTrigger>
            <AccordionContent>
              Since Ai Architect is available on five platforms worldwide, we
              are constantly increasing the number of languages you can choose
              for the app&apos;s interface.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              I have a connection failure. What am I supposed to do?
            </AccordionTrigger>
            <AccordionContent>
              You can try following these simple steps:
              <li>
                Try clearing cookies and the cache in the browser you use.
              </li>
              <li>Use the incognito mode in your browser to log in.</li>
              <li>Log in to your account with the new password provided.</li>
              <li>
                Try to log in to your account using a different browser, both in
                incognito and normal modes.
              </li>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Footer />
    </main>
  );
}

export default faqs;
