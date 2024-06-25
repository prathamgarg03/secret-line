import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(5, "Username must be atleast 5 characters long")
    .max(20, "Username must be no longer than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8, {message: "Password must be atleast 8 characters long"})
})
