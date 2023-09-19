import path from 'path'
import { execSync } from 'child_process'

import { describe, it, expect, afterAll } from 'vitest'
import axios from 'axios'
import dockerCompose from 'docker-compose'

describe('Register user flow', () => {
  it('should register an user with success', async () => {
    await dockerCompose.upMany([
      'proxy-reverse-e2e',
      'api-rest-dev',
      'database',
      'cache',
      'message-queue'
    ], {
      cwd: path.join(__dirname),
      commandOptions: ['--build']
    })

    execSync('docker exec api-rest npx prisma migrate deploy')
    execSync('docker exec api-rest npx prisma migrate reset --force')

    const response = await axios.post('http://localhost/v1/users', {
      name: 'Matheus Oliveira',
      email: 'matheus13@email.com',
      password: 'senha123.',
      type: 'STORE-ADMIN'
    })

    expect(response.status).toBe(201)
  }, 50000)

  afterAll(async () => {
    await dockerCompose.down({
      cwd: path.join(__dirname),
      log: true
    })
  })
})
