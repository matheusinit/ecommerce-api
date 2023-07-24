import { PrismaClient } from '@prisma/client'
import { env } from '~/config/env'

export const prisma = new PrismaClient({
  log: env.test
    ? ['info', 'warn', 'error']
    : [
        'query',
        'info',
        'warn',
        'error'
      ]
})
