import isCI from 'is-ci'
import dockerCompose from 'docker-compose'
import isPortReachable from 'is-port-reachable'

import path from 'path'
import { execSync } from 'child_process'

export const setup = async () => {
  console.log('Starting the global setup...')

  const isDbContainerRunning = await isPortReachable(5440, {
    host: '0.0.0.0'
  })

  if (!isCI) {
    if (!isDbContainerRunning) {
      await dockerCompose.upOne('testing-database', {
        cwd: path.join(__dirname),
        log: true
      })
    }

    const isInMemoryDbContainerRunning = await isPortReachable(6379, {
      host: '0.0.0.0'
    })

    if (!isInMemoryDbContainerRunning) {
      await dockerCompose.upOne('cache', {
        cwd: path.join(__dirname),
        log: true
      })
    }
  }

  // Run migrations with Prisma ORM
  execSync('pnpm prisma migrate deploy')
}

let teardownHappened = false

export const teardown = async () => {
  if (teardownHappened) {
    throw new Error('teardown called twice')
  }

  teardownHappened = true

  console.log('Starting the global teardown...')
}
