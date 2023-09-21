import { PrismaClient } from '@prisma/client'
import { afterAll, afterEach, beforeAll, describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { type User } from '~/data/dtos/user'
import { type MessageQueueResult, type UserMessageQueueRepository } from '~/data/repositories/protocols/user-repository-mq'

let prisma: PrismaClient

vi.mock('~/data/repositories/rabbitmq/user-message-queue-repository.ts', () => {
  class FakeUserMessageQueueRepository implements UserMessageQueueRepository {
    async addEmailTaskToQueue (email: string): Promise<MessageQueueResult> {
      return {
        error: false,
        message: 'Message acked'
      }
    }

    async listen (): Promise<string | null> {
      throw new Error('Method not implemented.')
    }
  }

  return {
    RabbitMqUserMessageQueueRepository: FakeUserMessageQueueRepository
  }
})

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

    it('when user type is \'CUSTOMER\', should get created', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'CUSTOMER',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(expect.objectContaining({
        name: 'Matheus Oliveira',
        type: 'CUSTOMER',
        email: 'matheus.oliveira@email.com',
        password: expect.any(String)
      }))
    })
  })

  describe('when adding a invalid body', () => {
    it('when name is not provided, should get bad request', async () => {
      // @ts-expect-error "Avoid field 'name' to test feature at missing field"
      const user: User = {
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when name is contains only spaces, should get bad request', async () => {
      const user: User = {
        name: ' '.repeat(10),
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when name has less than 3 characters, should get bad request', async () => {
      const user: User = {
        name: 'Jo',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveir@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when type is not provided, should get bad request', async () => {
      // @ts-expect-error "Avoid field 'type' to test feature at missing field"
      const user: User = {
        name: 'Matheus Oliveira',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when type contains only spaces, should get bad request', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        // @ts-expect-error "Do not use correct type for field 'type' to test feature"
        type: ' '.repeat(10),
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when type is neither \'STORE-ADMIN\' or \'CUSTOMER\', should get bad request', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        // @ts-expect-error "Use incorrect type for field 'type' to test feature"
        type: 'INVALID-USER-TYPE',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when email is not provided, should get bad request', async () => {
      // @ts-expect-error "Use incorrect type for field 'type' to test feature"
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when provided email is invalid, should get bad request', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'invalid-email',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when password is not provided, should get bad request', async () => {
      // @ts-expect-error "Avoid field 'password' to test feature at missing field"
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when provided password is has only non-special characters, should get bad request', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'password'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when provided password is has non-special characters e one number, should get bad request', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'password1'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('When confirmation email message could not be sent due to an error', () => {
    it('then should get internal server errror', async () => {
      const fakeUserMessageQueueRepository = await import('~/data/repositories/rabbitmq/user-message-queue-repository')
      fakeUserMessageQueueRepository.RabbitMqUserMessageQueueRepository.prototype.addEmailTaskToQueue = vi.fn().mockImplementation(async () => {
        return {
          error: true,
          message: 'Message nacked'
        }
      })

      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      const response = await request(app).post('/v1/users').send(user)

      expect(response.status).toBe(500)
      expect(response.body.message).toBe('The user was created, but for an internal error the confirmation email could not be sent. Please send a request to send the confirmation email again soon.')
    })
  })
})
