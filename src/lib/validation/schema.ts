import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  fullname: z.string(),
});
