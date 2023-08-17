import isCI from 'is-ci'
import dockerCompose from 'docker-compose'
import isPortReachable from 'is-port-reachable'

import path from 'path'
import { execSync } from 'child_process'

export const setup = async () => {
  console.log('Starting the global setup...')

  const isDatabaseRunning = await isPortReachable(5440, {
    host: '0.0.0.0'
  })

  if (!isCI) {
    if (!isDatabaseRunning) {
      await dockerCompose.upOne('testing-database', {
        cwd: path.join(__dirname),
        log: true
      })
    }

    const isInMemoryDatabaseRunning = await isPortReachable(6379, {
      host: '0.0.0.0'
    })

    if (!isInMemoryDatabaseRunning) {
      await dockerCompose.upOne('cache', {
        cwd: path.join(__dirname),
        log: true
      })
    }
  }

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
