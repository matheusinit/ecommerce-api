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

    it('then should return access token and refresh token', async () => {
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
      expect(response.body).toEqual(expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      }))
    })
  })

  describe('when using invalid credentials', () => {
    // [ ] when adding a empty email, then should get bad request
    // [ ] when adding a empty password, then should get bad request
    // [ ] when adding a invalid email, then should get bad request
    // [ ] when adding a invalid password, then should get bad request

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

    it('when adding a empty string as email, then should get bad request', async () => {
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
          email: '',
          password: user.password
        })

      expect(response.statusCode).toBe(400)
      expect(response.body).toBeDefined()
    })

    it('when not providing email field, then should get bad request', async () => {
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
          password: user.password
        })

      expect(response.statusCode).toBe(400)
      expect(response.body).toBeDefined()
    })

    it('when providing invalid email, then should get bad request', async () => {
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
          email: 'invalid-email@email.com',
          password: user.password
        })

      expect(response.statusCode).toBe(400)
      expect(response.body).toBeDefined()
    })

    it('when adding a empty string as password, then should get bad request', async () => {
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
          password: ''
        })

      expect(response.statusCode).toBe(400)
      expect(response.body).toBeDefined()
    })

    it('when providing invalid password, then should get bad request', async () => {
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
          password: 'invalid-password'
        })

      expect(response.statusCode).toBe(400)
      expect(response.body).toBeDefined()
    })

    it('when not providing password field, then should get bad request', async () => {
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
          email: user.email
        })

      expect(response.statusCode).toBe(400)
      expect(response.body).toBeDefined()
    })
  })
})
