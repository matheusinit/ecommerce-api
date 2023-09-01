import { beforeAll, afterEach, describe, expect, it, afterAll } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { PrismaClient } from '@prisma/client'
import { type User } from '~/data/dtos/user'

let prisma: PrismaClient

interface Tokens {
  accessToken: string
  refreshToken: string
}

describe('POST /auth/access-token', () => {
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

  describe('when using a valid refresh token', () => {
    it('then should return ok', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      await request(app)
        .post('/v1/users')
        .send(user)

      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: user.email,
          password: user.password
        })

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/auth/access-token')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send()

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeDefined()
    })
  })

  describe('when not using a token', () => {
    it('when not using refresh token, then should return unauthorized', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      await request(app)
        .post('/v1/users')
        .send(user)

      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: user.email,
          password: user.password
        })

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/auth/access-token')
        .set('Cookie', [`access-token=${tokens.accessToken}`])
        .send()

      expect(response.statusCode).toBe(401)
      expect(response.body).toBeDefined()
    })

    it('when not using access token, then should return unauthorized', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      await request(app)
        .post('/v1/users')
        .send(user)

      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: user.email,
          password: user.password
        })

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/auth/access-token')
        .set('Cookie', [`refresh-token=${tokens.refreshToken}`])
        .send()

      expect(response.statusCode).toBe(401)
      expect(response.body).toBeDefined()
    })
  })
})
