import { describe, it, expect, vitest, afterEach } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { PrismaConfirmationEmailTokenRepository } from '~/data/repositories/prisma/prisma-confirmation-email-token-repository'
import { prisma } from '~/infra/db'
import dayjs from 'dayjs'
import { PrismaUserRepository } from '~/data/repositories/prisma/prisma-user-repository'

describe('Confirm Email Controller', () => {
  afterEach(async () => {
    await prisma.user.deleteMany()
  })

  it('when invalid token is provided, then should get bad request', async () => {
    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .query({
        token: 'invalid-token'
      }).send()

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Invalid token')
  })

  it('when provided token is not found is database, then should get not found', async () => {
    const validToken = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'

    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .query({
        token: validToken
      }).send()

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('Token not found')
  })

  it('when provided token is expired, then should get bad request', async () => {
    const token = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'

    const userRepository = new PrismaUserRepository()

    await userRepository.store({
      email: 'matheus@email.com',
      type: 'CUSTOMER',
      password: 'hashing'
    })

    const repository = new PrismaConfirmationEmailTokenRepository()
    vitest.spyOn(repository, 'storeToken').mockImplementationOnce(async () => {
      await prisma.confirmationEmailToken.create({
        data: {
          userEmail: 'matheus@email.com',
          token,
          createdAt: dayjs().subtract(24, 'h').subtract(1, 's').toDate()
        }
      })
    })

    await repository.storeToken('matheus@email.com', token)

    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .query({
        token
      })
      .send()

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Token expired')
  })

  it('when user is already verified, then should get bad request', async () => {
    const token = 'faa61c5709342a843d3c3e5181474f22b3ad181471faa7c23d6d757bafa3883db473ae0088f727e1402b6c2a823557284742b4eaee94f5fe51af490eb96fdf26'
    const userRepository = new PrismaUserRepository()
    await userRepository.store({
      email: 'matheus@email.com',
      type: 'CUSTOMER',
      password: 'hashing'
    })
    await userRepository.verify('matheus@email.com')
    const repository = new PrismaConfirmationEmailTokenRepository()
    await repository.storeToken('matheus@email.com', token)

    const response = await request(app)
      .post('/v1/users/email-confirmation')
      .query({
        token
      })
      .send()

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('User is already verified')
  })
})
