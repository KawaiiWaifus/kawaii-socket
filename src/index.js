import {io, start, redis, readline, moment, st, log, debbug, redispass, pront, Debug} from './bootstrap'
import { watch } from './bootstrap/socketWatch'
import { setTimeout } from 'timers'

start()

let numUsers = 0
let users = []
let colors = []
let bans = []

watch(io, redis, numUsers, users, st, redispass, debbug)

if (pront.use) {
  var rl = readline.createInterface(process.stdin, process.stdout)
  rl.setPrompt(pront.prompt)
  rl.prompt()
}
  /* Internal */
  if(pront.use) {
    readLine()
  }
  
function readLine () {
  rl.on('line', (line) => {
    rl.prompt()

      // let data = {}

      if(line.indexOf('/users') == 0) {
        debbug('All users: ' + JSON.stringify(users))
      }

      if(line.indexOf('/updateList') == 0) {
        users.length = 0
        debbug('Update sent.')
        setTimeout(() => { io.emit('updateUsersList', true) }, 1000)
      }

      if(line.indexOf('/selectUser') == 0) {
        let select = line.substring(11)
        let user = users.filter(user => user.id == select)
        debbug(user)
      }

      if(line.indexOf('/debug') == 0) {
        debbug('Mode Debug: ' + Debug)
      }
    }).on('close', () => {
      debbug('stop Shutting down')
      process.exit(0)
  })
}
