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

      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: product.name,
          price: product.price,
          userId: user.id,
          createdAt: expect.any(String),
          updatedAt: null,
          deletedAt: null
        })
      ]))
    })
  })

  describe('None product', () => {
    it('when there isn\'t any product published, should get ok', async () => {
      const response = await request(app).get('/v1/products')

      expect(response.status).toBe(200)
    })

    it('when there isn\'t any product published, should return none products', async () => {
      const response = await request(app).get('/v1/products')

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

    it('when page query param is greater than the number of pages, should get not found', async () => {
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

      const response = await request(app).get('/v1/products?page=2')

      expect(response.status).toBe(404)
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
        _metadata: expect.objectContaining({
          page_count: 2,
          total_count: 20,
          page: 0,
          per_page: 10
        })
      }))
    })

    it('when query param include with metadata is provided, get links in metadata object', async () => {
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

      const response = await request(app).get('/v1/products?include=metadata&page=2&per_page=5')

      expect(response.body._metadata).toEqual(expect.objectContaining({
        links: [
          { self: '/products?page=2&per_page=5' },
          { first: '/products?page=0&per_page=5' },
          { prev: '/products?page=1&per_page=5' },
          { next: '/products?page=3&per_page=5' },
          { last: '/products?page=3&per_page=5' }
        ]
      }))
    })

    it('when first page is requested with metadata object, shouldn\'t get prev link', async () => {
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

      expect(response.body._metadata).toEqual(expect.objectContaining({
        links: [
          { self: '/products?page=0&per_page=10' },
          { first: '/products?page=0&per_page=10' },
          { next: '/products?page=1&per_page=10' },
          { last: '/products?page=1&per_page=10' }
        ]
      }))
    })

    it('when last page is requested with metadata object, shouldn\'t get next link', async () => {
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

      const response = await request(app).get('/v1/products?include=metadata&page=1')

      expect(response.body._metadata).toEqual(expect.objectContaining({
        links: [
          { self: '/products?page=1&per_page=10' },
          { first: '/products?page=0&per_page=10' },
          { prev: '/products?page=0&per_page=10' },
          { last: '/products?page=1&per_page=10' }
        ]
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

    it('when query param include with metadata is not provided, get links in response header', async () => {
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

      const response = await request(app).get('/v1/products')

      const linkReferences = [
        '</products?page=0&per_page=10>; rel="self"',
        '</products?page=0&per_page=10>; rel="first"',
        '</products?page=1&per_page=10>; rel="next"',
        '</products?page=1&per_page=10>; rel="last"'
      ]

      expect(response.headers.link).toEqual(linkReferences.join(','))
    })

    it('when a middle page is requested without query param include with metadata, should get prev link', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const productsToInsert = new Array(30).fill({
        name: falso.randProductName(),
        price: 29900
      })

      const productsPromise = productsToInsert.map(async product =>
        await request(app)
          .post('/v1/products')
          .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
          .send(product))

      await Promise.all(productsPromise)

      const response = await request(app).get('/v1/products?page=1')

      const linkReferences = [
        '</products?page=1&per_page=10>; rel="self"',
        '</products?page=0&per_page=10>; rel="first"',
        '</products?page=0&per_page=10>; rel="prev"',
        '</products?page=2&per_page=10>; rel="next"',
        '</products?page=2&per_page=10>; rel="last"'
      ]

      expect(response.headers.link).toEqual(linkReferences.join(','))
    })

    it('when the last page is requested without query param include with metadata, shouldn\'t get next link', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const productsToInsert = new Array(30).fill({
        name: falso.randProductName(),
        price: 29900
      })

      const productsPromise = productsToInsert.map(async product =>
        await request(app)
          .post('/v1/products')
          .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
          .send(product))

      await Promise.all(productsPromise)

      const response = await request(app).get('/v1/products?page=2')

      const linkReferences = [
        '</products?page=2&per_page=10>; rel="self"',
        '</products?page=0&per_page=10>; rel="first"',
        '</products?page=1&per_page=10>; rel="prev"',
        '</products?page=2&per_page=10>; rel="last"'
      ]

      expect(response.headers.link).toEqual(linkReferences.join(','))
    })
  })

  describe('Partial answers', () => {
    afterEach(async () => {
      await prisma.product.deleteMany()
    })

    it('when query param fields is provided, get partial content', async () => {
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

      const response = await request(app).get('/v1/products?fields=name')

      expect(response.status).toBe(206)
    })

    it('when query param fields is provided with value name, should return only the name field', async () => {
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

      const response = await request(app).get('/v1/products?fields=name')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          name: product.name
        }
      ]))
    })

    it('when query param fields is provided with value price, should return only the price field', async () => {
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

      const response = await request(app).get('/v1/products?fields=price')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          price: 29900
        }
      ]))
    })

    it('when query param fields is provided with value userId, should return only the userId field', async () => {
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

      const response = await request(app).get('/v1/products?fields=userId')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          userId: user.id
        }
      ]))
    })

    it('when query param fields is provided with value id, should return only the id field', async () => {
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

      const response = await request(app).get('/v1/products?fields=id')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          id: expect.any(String)
        }
      ]))
    })

    it('when query param fields is provided with value createdAt, should return only the createdAt field', async () => {
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

      const response = await request(app).get('/v1/products?fields=createdAt')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          createdAt: expect.any(String)
        }
      ]))
    })

    it('when query param fields is provided with value updatedAt, should return only the updatedAt field', async () => {
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

      const response = await request(app).get('/v1/products?fields=updatedAt')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          updatedAt: null
        }
      ]))
    })

    it('when query param fields is provided with value deletedAt, should return only the deletedAt field', async () => {
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

      const response = await request(app).get('/v1/products?fields=deletedAt')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          deletedAt: null
        }
      ]))
    })

    it('when query param fields is provided id, name and price as value, should return id, name and price fields', async () => {
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

      const { body: productPublished } = await request(app)
        .post('/v1/products')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send(product)

      const response = await request(app).get('/v1/products?fields=id,name,price')

      expect(response.body).toEqual(expect.arrayContaining([
        {
          id: productPublished.id,
          name: product.name,
          price: 29900
        }
      ]))
    })
  })

  describe('Searching', () => {
    afterEach(async () => {
      await prisma.product.deleteMany()
    })

    it('when query param name with \'a*\', get results with product name that starts with \'a\'', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const products = [
        {
          name: 'Awesome Concrete Hat',
          price: 29900
        },
        {
          name: 'Rustic Concrete Bike',
          price: 29900
        },
        {
          name: 'Tasty Concrete Chips',
          price: 29900

        }
      ]

      const productsPromise = products.map(async product =>
        await request(app)
          .post('/v1/products')
          .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
          .send(product))

      await Promise.all(productsPromise)

      const response = await request(app).get('/v1/products?name=a*')

      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Awesome Concrete Hat'
        })
      ])
    })

    it('when query param name with \'*a\', get results with product name that ends with \'a\'', async () => {
      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: 'matheus.oliveira@email.com',
          password: 'minhasenha1!'
        })

      const tokens: Tokens = body

      const products = [
        {
          name: 'Awesome Cotton Pizza',
          price: 29900
        },
        {
          name: 'Rustic Concrete Bike',
          price: 29900
        },
        {
          name: 'Tasty Concrete Chips',
          price: 29900

        }
      ]

      const productsPromise = products.map(async product =>
        await request(app)
          .post('/v1/products')
          .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
          .send(product))

      await Promise.all(productsPromise)

      const response = await request(app).get('/v1/products?name=*a')

      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Awesome Cotton Pizza'
        })
      ])
    })
  })
})
