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

    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return a message on success', async () => {
    interface Tokens {
      accessToken: string
      refreshToken: string
    }

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

  describe('when there is none product published', () => {
    it('should return none products', async () => {
      const response = await request(app).get('/v1/products')

      expect(response.status).toBe(200)
      expect(response.body.length).toBe(0)
      expect(response.body).toBeInstanceOf(Array)
    })
  })
})
