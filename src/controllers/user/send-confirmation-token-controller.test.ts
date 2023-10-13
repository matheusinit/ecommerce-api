import { describe, it, expect, afterEach, vi } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { prisma } from '~/infra/db'
import { type User } from '~/data/dtos/user'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'
import { PrismaConfirmationEmailTokenRepository } from '~/data/repositories/prisma/prisma-confirmation-email-token-repository'
import { hash } from '~/utils/hashing'
import { type Tokens } from '~/data/dtos/auth-tokens'

vi.mock('~/data/repositories/rabbitmq/user-message-queue-repository', async () => ({
  RabbitMqUserMessageQueueRepository: (await import('test/fakes/fake-user-message-queue-repository'))
    .FakeUserMessageQueueRepository
}))

describe('POST /v1/users/email-confirmation', () => {
  afterEach(async () => {
    await prisma.confirmationEmailToken.deleteMany()
    await prisma.user.deleteMany()
  })

  it('when user is not signed in, then should get unauthorized', async () => {
    const response = await request(app).post('/v1/users/email-confirmation').send({
      email: 'matheus@email.com'
    })

    expect(response.statusCode).toBe(401)
  })

  it('when email is not related to any user, then should get not found', async () => {
    const rawPassword = 'minhasenha1!'
    const hashedPassword = await hash(rawPassword)
    const user: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: hashedPassword
    }
    const userRepository = new PrismaUserRepository()
    await userRepository.store(user)
    const confirmationEmailTokenRepository = new PrismaConfirmationEmailTokenRepository()
    const token = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'
    await confirmationEmailTokenRepository.storeToken(user.email, token)
    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: user.email,
        password: rawPassword
      })

    const tokens: Tokens = body
    const email = 'not-existent-email@email.com'

    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        email
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('User not found with given email')
  })

  it('when user is verified, then should get bad request', async () => {
    const rawPassword = 'minhasenha1!'
    const hashedPassword = await hash(rawPassword)
    const user: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: hashedPassword
    }
    const userRepository = new PrismaUserRepository()
    await userRepository.store(user)
    const confirmationEmailTokenRepository = new PrismaConfirmationEmailTokenRepository()
    const token = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'
    await confirmationEmailTokenRepository.storeToken(user.email, token)
    await userRepository.verify(user.email)
    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: user.email,
        password: rawPassword
      })

    const tokens: Tokens = body

    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        email: user.email
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('User is already verified')
  })
})
