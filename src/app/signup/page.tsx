"use client";
import { motion } from "motion/react";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validation/schema";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log("onsubmit");
    try {
      // API call to login
      const result = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      });
      if (result.ok) {
        const response = await result.json();
        toast.success(response.message);
        form.reset();
        router.replace("/");
      } else {
        const response = await result.json();
        toast.error(response.message);
      }
    } catch (err) {
      console.log("🚀 ~ onSubmit ~ err:", err);
    }
  };

  return (
    <div className="flex justify-between items-center sm:p-9">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/ai5.png"
          alt="image is not found"
          width="700"
          height="700"
          className="rounded-3xl hidden md:block"
        />
      </motion.div>
      <motion.div
        className="text-center space-y-4 sm:mr-40  sm:mt-0 mt-40"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="uppercase font-semibold">Start for free</p>
        <p className="text-3xl font-bold mb-12">Create new account.</p>
        <p className="font-extralight">
          Already A Member?{" "}
          <Link href="login" className="font-semibold">
            Log In
          </Link>
        </p>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Input
              {...form.register("FirstName")}
              placeholder="First name"
              className="rounded-full"
              required
            ></Input>
            <Input
              {...form.register("LastName")}
              placeholder="last name"
              className="rounded-full"
              required
            ></Input>
          </div>
          <Input
            {...form.register("email")}
            placeholder="Email"
            className="rounded-full"
            required
          ></Input>
          <Input
            {...form.register("password")}
            placeholder="password"
            className="rounded-full"
            required
          ></Input>
          <Input
            {...form.register("fullname")}
            placeholder="fullname"
            className="rounded-full"
            required
          ></Input>
          <Button className="w-96 rounded-3xl" type="submit">
            Create account
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
