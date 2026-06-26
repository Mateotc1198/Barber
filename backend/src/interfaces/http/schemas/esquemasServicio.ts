import { z } from "zod";

const SHORT_TEXT = 60;
const MEDIUM_TEXT = 120;
const LONG_TEXT = 2000;
const MAX_URL = 500;
const MAX_LIST = 20;

export const esquemaServicio = z.object({
  name: z.string().trim().min(1).max(MEDIUM_TEXT),
  description: z.string().trim().max(LONG_TEXT).default(""),
  price: z.number().positive().finite(),
  category: z.string().trim().min(1).max(SHORT_TEXT),
  imageUrls: z.array(z.string().trim().min(1).max(MAX_URL)).min(1).max(5),
  cupos: z.number().int().min(0),
  duracionMinutos: z.number().int().min(1).max(480),
  customOptions: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(SHORT_TEXT),
        values: z.array(z.string().trim().min(1).max(SHORT_TEXT)).min(1).max(MAX_LIST),
      })
    )
    .max(10)
    .optional(),
});

export const esquemaCupos = z.object({
  cupos: z.number().int().min(0),
});

export const esquemaLogin = z.object({
  username: z.string().trim().min(1).max(SHORT_TEXT),
  password: z.string().min(1).max(128),
});
