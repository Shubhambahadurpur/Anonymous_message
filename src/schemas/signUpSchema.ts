import { z } from "zod";

export const UserName = z
  .string()
  .min(3, "Username must be atleast of 3 characters")
  .max(14, "Username must not be more than 14 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Username doesn't contain special charachter");

export const signUpSchema = z.object({
  username: UserName,
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(5, {message: "Password must be atleast of 5 characters"})
    .max(10, {message: "Password must not be more than 10 characters"})
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {message: "Password must have one special character,one UpperCase and one digit"}),
});
