import { createClient } from 'redis'
import { env } from '~/config/env'

if (!env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined')
}

// if (!env.REDIS_PASSWORD) {
//   throw Error('REDIS_PASSWORD is not defined')
// }
//
// if (!env.REDIS_HOST) {
//   throw Error('REDIS_HOST is not defined')
// }
//
// if (!env.REDIS_PORT) {
//   throw Error('REDIS_PORT is not defined')
// }

const redis = createClient({
  // url: `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`
  url: env.REDIS_URL
})

redis.on('error', err => { console.log('Redis Client Error', err) })

redis.connect().then(() => {
  console.log('Connect to Redis client')
}).catch((error) => {
  console.log('An error occured')
  console.log(error)
})

export default redis
