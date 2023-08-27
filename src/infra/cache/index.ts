import { createClient } from 'redis'
import { env } from '~/config/env'

if (!env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined')
}

const redis = createClient({
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
