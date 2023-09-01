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

describe('POST /products', () => {
  beforeAll(async () => {
    prisma = new PrismaClient()

    await prisma.$connect()

    const user: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: 'minhasenha1!'
    }

    await request(app).post('/v1/users').send(user)
  })

  afterEach(async () => {
    await prisma.product.deleteMany()
  })

  afterAll(async () => {
    await prisma.user.deleteMany()

    await prisma.$disconnect()
  })

  it('should return the product data on success', async () => {
    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      })

    const tokens: Tokens = body

    const response = await request(app)
      .post('/v1/products')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
        price: 29900
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({
      name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
      price: 29900,
      createdAt: expect.any(String)
    }))
  })

  it('should get unauthorized when not providing access token', async () => {
    const response = await request(app)
      .post('/v1/products')
      .send({
        name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
        price: 29900
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBeDefined()
  })

  describe('when using invalid body', () => {
    it('when name is not specified, then should get bad request', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/products')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send({
          price: 29900
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when price is not specified, then should get bad request', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/products')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send({
          name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear'
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })

    it('when name is an empty string, then should get bad request', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/products')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send({
          name: '',
          price: 29900
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBeDefined()
    })
  })

  it('when price is an empty string, then should get bad request', async () => {
    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      })

    const tokens: Tokens = body

    const response = await request(app)
      .post('/v1/products')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
        price: ''
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toBeDefined()
  })

  it('when name has less than 5 characters, then should get bad request', async () => {
    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      })

    const tokens: Tokens = body

    const response = await request(app)
      .post('/v1/products')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: 'Fio',
        price: 29900
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toBeDefined()
  })
})
