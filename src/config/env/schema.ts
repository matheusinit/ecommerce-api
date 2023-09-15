// config/env.ts
import * as z from 'zod'

export const productionEnvSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  PORT: z.number().optional(),
  REDIS_URL: z.string(),
  DATABASE_URL: z.string(),
  MQ_URL: z.string().default('amqp://localhost')
})
