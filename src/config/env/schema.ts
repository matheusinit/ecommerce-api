// config/env.ts
import * as z from 'zod'

export const productionEnvSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  PORT: z.number(),
  REDIS_URL: z.string(),
  DATABASE_URL: z.string()
})
