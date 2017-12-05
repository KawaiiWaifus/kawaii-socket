/**
 * MODULES
 */
export const moment = require('moment')
export const st = require('styleme')
const app = require('express')()
const server = require('http').Server(app)
export const io = require('socket.io')(server)
export { Redis } from './redis'
export const readline = require('readline')

/**
 * CONFIGS
 */
import { LogOn, port, version, Debug, serverName } from './config'
export { pront, Debug } from './config'

/**
 * DEBUGS
 */
export const debbug = (message) => {
  let time =  st.red('{DEBUG}') + st.gre('[') + st.und(moment().format('D/M/Y - h:mm:ss a')) + st.gre(']') + ' -'
  if (Debug) {
      console.log(time, message)
  }
}

export const log = (message) => {
  let time = st.gre('[') + st.yel(moment().format('D/M/Y - h:mm:ss a')) + st.gre(']') + ' -'
  if (LogOn) {
      console.log(time, message)
  }
}

/**
 * SERVER START
 */
export const start = () => server.listen(port, () => {
  log(st.yel('Server') + ' on ' + st.yel('port') + ': ' + st.cya(port))
  log(st.yel('Server: ') + st.cya(serverName) + st.yel(' v' + version) + st.gre(' Started!'))
  if (Debug) {
    log(st.gre('Mode 🔥  ' + st.red('Debug ') + st.gre('ON!') ))
  }
  else {
    log(st.gre('Mode 🔥  ' + st.red('Debug ') + st.red('OFF!') ))
  }
})
