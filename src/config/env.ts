// config/env.ts
import * as z from 'zod'

import * as dotenv from 'dotenv'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

// -------------------
// Base env schema
// -------------------
const baseSchema = z
  .object({
    production: z.boolean(),
    development: z.boolean(),
    test: z.boolean()
  })
  .nonstrict()

// ----------------------
// Production env schema
// ----------------------
const productionEnvSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  PORT: z.number(),
  REDIS_PASSWORD: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string()
})

let envSchema
if (isProduction) {
  envSchema = baseSchema.merge(productionEnvSchema)
} else {
  envSchema = baseSchema.merge(productionEnvSchema.partial())
}

export const env = envSchema.parse({
  ...process.env,
  production: isProduction,
  development: isDevelopment,
  test: isTest
})
