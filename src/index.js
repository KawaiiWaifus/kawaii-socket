import {io, start, redis, readline, moment, st, log, debbug, redispass, pront, Debug} from './bootstrap'
import { watch } from './bootstrap/socketWatch'
import { command } from './bootstrap/command'

start()

let numUsers = 0
let users = []
let colors = []
let bans = []

watch(io, redis, numUsers, users, st, redispass, debbug)

if (pront.use) {
  let rl = readline.createInterface(
    process.stdin,
    process.stdout
  )
  rl.setPrompt(pront.prompt)
  rl.prompt()
  command({ io, rl, users, debbug })
}
