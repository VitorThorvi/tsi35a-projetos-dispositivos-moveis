import { z } from "zod";

export const jsonStringArray = z
  .string()
  .transform((raw, ctx) => {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      ctx.addIssue({ code: "custom", message: "JSON inválido." });
      return z.NEVER;
    }
  })
  .pipe(z.array(z.string()));
