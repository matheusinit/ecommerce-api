import * as z from 'zod'
import * as dotenv from 'dotenv'
import { productionEnvSchema } from './schema'

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

let envSchema
if (isProduction) {
  envSchema = baseSchema.merge(productionEnvSchema)
} else {
  envSchema = baseSchema.merge(productionEnvSchema.partial())
}

export const env = envSchema.parse({
  ...process.env,
  PORT: Number(process.env.PORT),
  production: isProduction,
  development: isDevelopment,
  test: isTest
})
