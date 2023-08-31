import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import falso from '@ngneat/falso'
import app from '~/app'
import { PrismaClient } from '@prisma/client'
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

describe('PUT /products/:id', () => {
  beforeAll(async () => {
    const prisma = new PrismaClient()

    await prisma.$connect()

    const user: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: 'minhasenha1!'
    }

    await request(app).post('/v1/users').send(user)
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

    const { body: product } = await request(app)
      .post('/v1/products')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: randProductName,
        price: randPrice
      })

    // Act
    const response = await request(app).put(`/v1/products/${product.id}`).send({})

    // Assert
    expect(response.status).toBe(400)
  })
})
