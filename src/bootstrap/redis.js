const redisClient = require('redis')
let bluebird = require('bluebird')
import { redisPass, redisPort } from './config'

bluebird.promisifyAll(redisClient.RedisClient.prototype)
bluebird.promisifyAll(redisClient.Multi.prototype)

const redis = redisClient.createClient({ port: redisPort, auth_pass: redisPass })

class Redis {
  static get db() {
		return redis
	}

  static start () {
		redis.on('error', error => console.error(`[REDIS]: Encountered error: \n${error}`))
		  .on('reconnecting', () => console.warn('[REDIS]: Reconnecting...'))
	}
}

Redis.start()

export {
  Redis
}
