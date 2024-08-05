import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(5, "Username must be atleast 5 characters long")
    .max(20, "Username must be no longer than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special characters")

const passwordValidation = z.string()
    .min(8, { message: "Password must be atleast 8 characters long" })

export const usernameSchema = z.object({
    username: usernameValidation
})

export const passwordSchema = z.object({
    password: passwordValidation
})

export const resetPasswordSchema = z.object({
    oldPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmPassword: passwordValidation
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
})

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: passwordValidation
})
