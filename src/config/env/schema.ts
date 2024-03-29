// config/env.ts
import * as z from 'zod'

export const productionEnvSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  PORT: z.number().optional(),
  REDIS_URL: z.string(),
  DATABASE_URL: z.string(),
  MQ_URL: z.string().default('amqp://localhost'),
  SMTP_PROVIDER: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string()
})
