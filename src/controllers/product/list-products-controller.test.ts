import { beforeAll, afterEach, describe, expect, it, afterAll } from 'vitest'
import request from 'supertest'
import app from '~/app'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

describe('List products controller', () => {
  beforeAll(async () => {
    prisma = new PrismaClient()

    await prisma.$connect()

    await request(app).post('/v1/user').send({
      name: 'Tester',
      email: 'tester@email.com',
      type: 'STORE-ADMIN',
      password: 'testerpass13!'
    })
  })

  afterEach(async () => {
    const product = await prisma.product.findFirst({
      where: {
        name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear'
      }
    })

    await prisma.product.delete({
      where: {
        id: product?.id ?? ''
      }
    })

    await prisma.user.delete({
      where: {
        email: 'tester@email.com'
      }
    })
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
        email: 'tester@email.com',
        password: 'testerpass13!'
      })

    const tokens: Tokens = body

    await request.agent(app)
      .post('/v1/product')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
        price: 29900
      })

    const response = await request(app).get('/v1/product/')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body.at(0)).toEqual(expect.objectContaining({
      name: 'Teclado Mecânico com fio Logitech K835 TKL com Estrutura de Alumínio e Switch Red Linear',
      price: 29900
    }))
  })
})
