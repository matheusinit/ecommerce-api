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

  describe('Valid products', () => {
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
      expect(response.body.length).toBe(1)
      expect(response.body.at(0)).toEqual(expect.objectContaining({
        name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
        price: 29900
      }))
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
  })

  describe('None product', () => {
    it('when there isn\'t any product published, should return none products', async () => {
      const response = await request(app).get('/v1/products')

      expect(response.status).toBe(200)
      expect(response.body.length).toBe(0)
      expect(response.body).toBeInstanceOf(Array)
    })
  })
})
