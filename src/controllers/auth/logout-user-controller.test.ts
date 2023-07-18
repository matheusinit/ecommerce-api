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

describe('POST /logout', () => {
  beforeAll(async () => {
    prisma = new PrismaClient()

    await prisma.$connect()
  })

  afterEach(async () => {
    // await prisma.user.delete({
    //   where: {
    //     email: 'matheus.oliveira@email.com'
    //   }
    // })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('when adding a valid access token cookie', () => {
    it('then should logout user', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      await request(app)
        .post('/v1/user')
        .send(user)

      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: user.email,
          password: user.password
        })

      interface Tokens {
        accessToken: string
        refreshToken: string
      }

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/auth/logout')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send()

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeDefined()
    })

    it('should return success property as true', async () => {
      const user: User = {
        name: 'Matheus Oliveira',
        type: 'STORE-ADMIN',
        email: 'matheus.oliveira@email.com',
        password: 'minhasenha1!'
      }

      await request(app)
        .post('/v1/user')
        .send(user)

      const { body } = await request(app)
        .post('/v1/auth')
        .send({
          email: user.email,
          password: user.password
        })

      interface Tokens {
        accessToken: string
        refreshToken: string
      }

      const tokens: Tokens = body

      const response = await request(app)
        .post('/v1/auth/logout')
        .set('Cookie', [`access-token=${tokens.accessToken}`, `refresh-token=${tokens.refreshToken}`])
        .send()

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        success: true
      })
    })
  })

  it('when using any access token cookie, then should get unauthorized', async () => {
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
      .post('/v1/auth/logout')
      .send()

    expect(response.statusCode).toBe(401)
    expect(response.body).toBeDefined()
  })

  it('when using invalid access token cookie, then should get unauthorized', async () => {
    const user: User = {
      name: 'Matheus Oliveira',
      type: 'STORE-ADMIN',
      email: 'matheus.oliveira@email.com',
      password: 'minhasenha1!'
    }

    await request(app)
      .post('/v1/user')
      .send(user)

    const accessToken = 'invalid-cookie'
    const refreshToken = 'invalid-cookie'

    const response = await request(app)
      .post('/v1/auth/logout')
      .set('Cookie', [`access-token=${accessToken}`, `refresh-token=${refreshToken}`])
      .send()

    expect(response.statusCode).toBe(401)
    expect(response.body).toBeDefined()
    expect(response.body.message).toEqual('invalid access token cookie')
  })
})
