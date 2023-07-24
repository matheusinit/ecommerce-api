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
})
