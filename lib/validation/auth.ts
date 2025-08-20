// lib/validation/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const userTypeSchema = z.enum(["scholar", "admin", "supervisor"], {
  error: "Invalid user type",
});

export type UserType = z.infer<typeof userTypeSchema>;
