import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '~/app'

describe('POST /v1/users/email-confirmation', () => {
  it('when user is not signed in, then should get unauthorized', async () => {
    const response = await request(app).post('/v1/users/email-confirmation').send()

    expect(response.statusCode).toBe(401)
  })
})
