import { beforeAll, afterEach, vi, describe, expect, it, afterAll } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { PrismaClient } from '@prisma/client'
import { type User } from '~/data/dtos/user'
import { type Tokens } from '~/data/dtos/auth-tokens'

let prisma: PrismaClient

vi.mock('~/data/repositories/rabbitmq/user-message-queue-repository', async () => ({
  RabbitMqUserMessageQueueRepository: (await import('test/fakes/fake-user-message-queue-repository'))
    .FakeUserMessageQueueRepository
}))

vi.mock('~/config/mq/email-consumer', async () => ({
  EmailConsumer: (await import('test/fakes/fake-email-consumer'))
    .FakeEmailConsumer
}))

describe('POST /auth/logout', () => {
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

  describe('when adding a valid access token cookie', () => {
    it('then should logout user', async () => {
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
        .post('/v1/auth/logout')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send()

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeDefined()
    })

    it('should return success property as true', async () => {
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
        .post('/v1/auth/logout')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send()

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        success: true
      })
    })

    it('should clear cookies from response', async () => {
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
        .post('/v1/auth/logout')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send()

      const cookies = response.header['set-cookie']

      const accessTokenCookie = String(cookies[0].split(';').at(0)).split('=').at(1)
      const refreshTokenCookie = String(cookies[1].split(';').at(0)).split('=').at(1)

      expect(accessTokenCookie).toBe('')
      expect(refreshTokenCookie).toBe('')
    })
  })

  it('when using any access token cookie, then should get unauthorized', async () => {
    const user: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: 'minhasenha1!'
    }

    await request(app)
      .post('/v1/users')
      .send(user)

    const response = await request(app)
      .post('/v1/auth/logout')
      .send()

    expect(response.statusCode).toBe(401)
    expect(response.body).toBeDefined()
  })

  it('when using invalid access token cookie, then should get unauthorized', async () => {
    const user: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: 'minhasenha1!'
    }

    await request(app)
      .post('/v1/users')
      .send(user)

    const accessToken = 'invalid-cookie'
    const refreshToken = 'invalid-cookie'

    const response = await request(app)
      .post('/v1/auth/logout')
      .set('Cookie', [`access-token=${accessToken}`, `refresh-token=${refreshToken}`])
      .send()

    expect(response.statusCode).toBe(401)
    expect(response.body).toBeDefined()
  })
})
