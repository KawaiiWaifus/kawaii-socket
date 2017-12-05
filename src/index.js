import {io, start, Redis, readline, moment, st, log, debbug, pront, Debug} from './bootstrap'
import { watch } from './bootstrap/socketWatch'
import { command } from './bootstrap/command'

start()

let numUsers = 0
let bans = []

watch(io, Redis, numUsers, st, debbug)

if (pront.use) {
  let rl = readline.createInterface(
    process.stdin,
    process.stdout
  )
  rl.setPrompt(pront.prompt)
  rl.prompt()
  command({ io, rl, debbug })
}
