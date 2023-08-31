import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import falso from '@ngneat/falso'
import app from '~/app'
import { PrismaClient, type Product } from '@prisma/client'
import { type UserType } from '~/data/dtos/user-type'

interface Tokens {
  accessToken: string
  refreshToken: string
}

interface User {
  name: string
  type: UserType
  email: string
  password: string
}

let prisma: PrismaClient

describe('PUT /products/:id', () => {
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

  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  it('when changes to data is not provided, then should get bad request', async () => {
    // Arrange
    const randProductName = falso.randProductName()
    const randPrice = falso.randNumber({ min: 0 })

    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      })

    const tokens: Tokens = body

    const { body: productBody } = await request(app)
      .post('/v1/products')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: randProductName,
        price: randPrice
      })

    const product = productBody as Product

    // Act
    const response = await request(app).put(`/v1/products/${product.id}`).send({})

    // Assert
    expect(response.status).toBe(400)
  })
})
