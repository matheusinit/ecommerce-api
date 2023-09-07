import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import falso from '@ngneat/falso'
import app from '~/app'
import { PrismaClient, type Product } from '@prisma/client'
import { type User } from '~/data/dtos/user'
import { type Tokens } from '~/data/dtos/auth-tokens'

let prisma: PrismaClient

const makeProductInput = () => ({
  name: falso.randProductName(),
  price: falso.randNumber({ min: 0 })
})

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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({})

    // Assert
    expect(response.status).toBe(400)
  })

  it('when product id is not provided, then should get not found', async () => {
    // Arrange
    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      })

    const tokens: Tokens = body

    // Act
    const response = await request(app)
      .put('/v1/products/')
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send()

    // Assert
    expect(response.status).toBe(404)
  })

  it('when a product id is an integer, then should get bad request', async () => {
    // Arrange
    const id = falso.randNumber({ min: 0 })
    const { body } = await request(app)
      .post('/v1/auth')
      .send({
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      })

    const tokens: Tokens = body

    // Act
    const response = await request(app)
      .put(`/v1/products/${id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send()

    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Product id must be a cuid'
    })
  })

  it('when name provided is an empty string, then should get bad request', async () => {
    // Arrange

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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: ''
      })

    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Name cannot be a empty string'
    })
  })

  it('when price provided is a negative number, should get bad request', async () => {
    // Arrange

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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        price: falso.randNumber({ min: -99999, max: -1 })
      })

    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Price cannot be a negative number'
    })
  })

  it('when stock provided is a negative number, should get bad request', async () => {
    // Arrange

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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        stock: falso.randNumber({ min: -99999, max: -1 })
      })

    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Stock cannot be a negative number'
    })
  })

  it('when name provided has less than 3 characters, should get bad request', async () => {
    // Arrange
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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: 'Ab'
      })

    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Name must be at least 3 characters long'
    })
  })

  it('when user is not authenticated, then should get unauthorized', async () => {
    // Arrange
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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .send({
        name: 'Frozen'
      })

    // Assert
    expect(response.status).toBe(401)
  })

  it('when valid data is provided, then should get ok', async () => {
    // Arrange
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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: 'Frozen'
      })

    // Assert
    expect(response.status).toBe(200)
  })

  it('when valid data is provided, then should get the product data created', async () => {
    // Arrange
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
      .send(makeProductInput())

    const product = productBody as Product

    // Act
    const response = await request(app)
      .put(`/v1/products/${product.id}`)
      .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
      .send({
        name: 'Frozen'
      })

    // Assert
    expect(response.body).toEqual({
      id: product.id,
      name: 'Frozen',
      price: product.price,
      stock: product.stock,
      userId: product.userId,
      createdAt: product.createdAt,
      updatedAt: expect.any(String),
      deletedAt: null
    })
  })
})
