import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const resetPasswordSchema = loginInputSchema.pick({ email: true });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
