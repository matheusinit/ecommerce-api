import { execSync } from 'child_process'

export const setup = async () => {
  console.log('Starting the global setup...')

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
