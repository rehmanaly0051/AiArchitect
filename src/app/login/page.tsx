"use client";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation/schema";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log("onsubmit", data);
    try {
      // Construct the URL with query parameters (email and password)
      const url = new URL("/api/login", window.location.origin);
      url.searchParams.append("email", data.email);
      url.searchParams.append("password", data.password);

      // API call to login using GET
      const result = await fetch(url.toString(), {
        method: "GET", // Using GET here
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
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="flex justify-between items-center sm:p-9">
      <motion.div
        className="sm:ml-36 ml-1 sm:mt-0 mt-40 text-center space-y-4"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-3xl font-bold mb-12">Welcome back 👋</p>
        <p>Please enter your details.</p>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            {...form.register("email")}
            placeholder="Email"
            className="rounded-full"
            required
          ></Input>
          <Input
            {...form.register("password")}
            placeholder="Password"
            className="rounded-full"
            required
          ></Input>
          <p className="text-end text-gray-400 font-extralight">
            Forget password?
          </p>
          <Button className="w-96 rounded-3xl" type="submit">
            Log in
          </Button>
          <p className="text-gray-400">
            Don&apos;t have an account? &nbsp;
            <Link href="/signup" className="font-medium text-black ">
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/ai4.jpg"
          alt="image is not found"
          width="700"
          height="700"
          className="rounded-3xl hidden md:block"
        />
      </motion.div>
    </div>
  );
};

export default Login;
