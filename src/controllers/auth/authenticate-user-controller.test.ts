import { beforeAll, afterEach, describe, expect, it, afterAll } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { PrismaClient } from '@prisma/client'

import { type UserType } from '~/data/dtos/user-type'

let prisma: PrismaClient

interface User {
  name: string
  type: UserType
  email: string
  password: string
}

describe('POST /auth', () => {
  beforeAll(async () => {
    prisma = new PrismaClient()

    await prisma.$connect()
  })

  afterEach(async () => {
    await prisma.user.delete({
      where: {
        email: 'matheus.oliveira@email.com'
      }
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('when adding a valid user and body', () => {
    it('then should authenticate user', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      await request(app)
        .post('/v1/user')
        .send(user)

      const response = await request(app)
        .post('/v1/auth')
        .send({
          email: user.email,
          password: user.password
        })

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeDefined()
    })
  })

  describe('when adding invalid credentials', () => {
    it('then should get bad request', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      await request(app)
        .post('/v1/user')
        .send(user)

      const response = await request(app)
        .post('/v1/auth')
        .send({
          email: 'invalid.email@email.com',
          password: 'wrong-password'
        })

      expect(response.statusCode).toBe(400)
      expect(response.body).toBeDefined()
    })
  })
})