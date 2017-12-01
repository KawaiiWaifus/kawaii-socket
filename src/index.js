import {io, start, redis, moment, st, log, debbug, redispass} from './bootstrap'

start()

let numUsers = 0
let Users = []

io.on('connection', function (socket) {
  ++numUsers

  debbug(st.mag('User') + ' ' + st.gre('online') + ' ' + st.yel('id') + ': ' + st.red(socket.id)  + ' total online: ' + st.cya(numUsers))

  /**
   * Redis
   */
  let r = redis.createClient({auth_pass: redispass})

  r.subscribe('messages')
  r.subscribe('permissions')
  r.subscribe('maintenance')

 // r.subscribe('delmessage')
 // r.subscribe('editmessage')
 // r.subscribe('isTyping')

 socket.on('setUser',  function (obj) {
    if (socket.id !== null) {

      debbug('user updated, socket id: ' + socket.id + ' now is: ' + st.red(obj.id))

      socket.id = obj.id
/*
      Users.push({
        'id': obj.id,
        'name': obj.name,
        'stats': obj.stats,
        'isTyping': false
      })
*/
    }
  })

  r.on("message", function (channel, message) {
    socket.emit(channel, message)
    debbug('log: ' + channel + ' ' + message)
  })

  r.on("permissions", function (channel, message) {
    socket.emit(channel, message)
    debbug('log: ' + channel + ' ' + message)
  })

  r.on("maintenance", function (channel, message) {
    socket.emit(channel, message)
    debbug('log: ' + channel + ' ' + message)
  })

  socket.on("isTyping", function (message) {
    io.emit("isTyping", message)
    debbug('log: id: ' + socket.id + ' - ' + message)
  })

  socket.on("delmessage", function (channel, message) {
    socket.emit(channel, message)
    debbug('log: ' + message)
  })

  socket.on("editmessage", function (channel, message) {
    socket.emit(channel, message)
    debbug('log: ' + message)
  })

  socket.on("online", function (message) {
    socket.emit(channel, message)
    debbug('log: ' + message)
  })

  socket.on('disconnect',  function () {
    if (numUsers !== 0) {
      --numUsers
      r.quit()
    }
    debbug('Client desconected id: ' + socket.id)
  })

})
