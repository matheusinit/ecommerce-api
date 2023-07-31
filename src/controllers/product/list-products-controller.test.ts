import { beforeAll, afterEach, describe, expect, it, afterAll } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { PrismaClient } from '@prisma/client'
import { type UserType } from '~/data/dtos/user-type'
import falso from '@ngneat/falso'

let prisma: PrismaClient

interface User {
  name: string
  type: UserType
  email: string
  password: string
}

interface Tokens {
  accessToken: string
  refreshToken: string
}

describe('GET /products', () => {
  let user

  beforeAll(async () => {
    prisma = new PrismaClient()

    await prisma.$connect()

    const userData: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: 'minhasenha1!'
    }

    const response = await request(app).post('/v1/users').send(userData)
    user = response.body
  })

  afterAll(async () => {
    await prisma.user.deleteMany()

    await prisma.$disconnect()
  })

  describe('Valid products', () => {
    afterEach(async () => {
      await prisma.product.deleteMany()
    })

    it('when product is published, get a positive result', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      await request(app)
        .post('/v1/products')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send({
          name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
          price: 29900
        })

      const response = await request(app).get('/v1/products')

      expect(response.status).toBe(200)
    })

    it('when products are published, products should return paginated', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const productsToInsert = new Array(10).fill({
        name: falso.randProductName(),
        price: 29900
      })

      const productsPromise = productsToInsert.map(async product =>
        await request(app)
          .post('/v1/products')
          .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
          .send(product))

      await Promise.all(productsPromise)

      const response = await request(app).get('/v1/products?per_page=5&page=1')

      expect(response.status).toBe(200)
      expect(response.body.length).toBe(5)
      expect(response.header['pagination-total-count']).toBe('10')
      expect(response.header['pagination-page-count']).toBe('2')
    })

    it('when products are published, should return an list of object with product data', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const product = {
        name: falso.randProductName(),
        price: 29900
      }

      await request(app)
        .post('/v1/products')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send(product)

      const response = await request(app).get('/v1/products?per_page=5&page=0')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: product.name,
          price: product.price,
          userId: user.id,
          updatedAt: expect.any(String),
          deletedAt: null
        })
      ]))
    })
  })

  describe('None product', () => {
    it('when there isn\'t any product published, should return none products', async () => {
      const response = await request(app).get('/v1/products')

      expect(response.status).toBe(200)
      expect(response.body.length).toBe(0)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('Pagination', () => {
    afterEach(async () => {
      await prisma.product.deleteMany()
    })

    it('when per page query param is 0, should get a bad request', async () => {
      const response = await request(app).get('/v1/products?per_page=0')

      expect(response.status).toBe(400)
    })

    it('when include with metadata query is provided, should get pagination metadata in response body', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const productsToInsert = new Array(20).fill({
        name: falso.randProductName(),
        price: 29900
      })

      const productsPromise = productsToInsert.map(async product =>
        await request(app)
          .post('/v1/products')
          .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
          .send(product))

      await Promise.all(productsPromise)

      const response = await request(app).get('/v1/products?include=metadata')

      expect(response.body).toEqual(expect.objectContaining({
        _metadata: {
          page_count: 2,
          total_count: 20,
          page: 0,
          per_page: 10
        }
      }))
    })

    it('when query param include with metadata is not provided, get pagination metadata in response headers', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const productsToInsert = new Array(15).fill({
        name: falso.randProductName(),
        price: 29900
      })

      const productsPromise = productsToInsert.map(async product =>
        await request(app)
          .post('/v1/products')
          .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
          .send(product))

      await Promise.all(productsPromise)

      const response = await request(app).get('/v1/products')

      expect(response.header['pagination-per-page']).toBe('10')
      expect(response.header['pagination-page']).toBe('0')
      expect(response.header['pagination-total-count']).toBe('15')
      expect(response.header['pagination-page-count']).toBe('2')
    })
  })
})
