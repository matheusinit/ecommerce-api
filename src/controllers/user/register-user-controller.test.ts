import { PrismaClient } from '@prisma/client'
import { afterAll, afterEach, beforeAll, describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { type UserType } from '~/data/dtos/user-type'

let prisma: PrismaClient
interface User {
  name: string
  type: UserType
  email: string
  password: string
}
describe('POST /users', () => {
  beforeAll(async () => {
    prisma = new PrismaClient()

    await prisma.$connect()
  })

  afterEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('when adding a valid body', () => {
    it('should get created', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining({
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: expect.any(String)
      }))
    })
  })
})
