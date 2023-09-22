import path from 'path'
import { execSync } from 'child_process'

import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import axios from 'axios'
import dockerCompose from 'docker-compose'
import amqp from 'amqplib'
import { ImapFlow } from 'imapflow'

describe('Register user flow', () => {
  beforeAll(async () => {
    await dockerCompose.upMany([
      'proxy-reverse-e2e',
      // 'api-rest-dev',
      'database',
      'cache',
      'message-queue'
    ], {
      cwd: path.join(__dirname),
      log: true,
      commandOptions: ['--build']
    })

    await dockerCompose.buildOne('api-rest-dev', {
      cwd: path.join(__dirname),
      log: true,
      commandOptions: ['--no-cache']
    })

    await dockerCompose.upOne('api-rest-dev', {
      cwd: path.join(__dirname),
      log: true
    })

    execSync('docker exec api-rest npx prisma migrate deploy')
    execSync('docker exec api-rest npx prisma migrate reset --force')
  }, 5000000)

  it('should register an user with success', async () => {
    const messageQueueAddress = 'amqp://0.0.0.0:5672'
    const connection = await amqp.connect(messageQueueAddress)
    const channel = await connection.createChannel()
    const queue = await channel.assertQueue('confirmation-email')

    const smtpClient = new ImapFlow({
      host: 'imap.ethereal.email',
      port: 993,
      secure: true,
      auth: {
        user: 'johathan.miller77@ethereal.email',
        pass: 'EUKwwjbS5Qax2ZJDBt'
      }
    })

    await smtpClient.connect()

    const lock = await smtpClient.getMailboxLock('INBOX')

    const message = await smtpClient.fetchOne(smtpClient.mailbox.exists, { source: true })

    const emailContent = message.source.toString()

    lock.release()

    await smtpClient.logout()

    const response = await axios.post('http://localhost/v1/users', {
      name: 'Matheus Oliveira',
      email: 'matheus@email.com',
      password: 'senha123.',
      type: 'STORE-ADMIN'
    })

    expect(response.status).toBe(201)
    expect(queue.consumerCount).toBe(1)
    expect(emailContent).toContain('From: Ecommerce <johathan.miller77@ethereal.email>')
    expect(emailContent).toContain('To: matheus@email.com')
  }, 100000)

  afterAll(async () => {
    await dockerCompose.down({
      cwd: path.join(__dirname),
      log: true
    })
  }, 5000000)
})
