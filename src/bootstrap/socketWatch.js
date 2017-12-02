export const watch = (io, redis, numUsers, users, st, redispass, debbug) => {

  io.on('connection', (socket) => {
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

  socket.on('setUser', (obj) => {
      if (socket.id !== null) {

        debbug(st.mag('User') + ', socket id: ' + st.red(socket.id) + ' now is: ' + st.red(obj.id))

        socket.id = obj.id

        users.push({id: obj.id, name: obj.name, isTyping: false})

      }
    })

    r.on("message", (channel, message) => {
      socket.emit(channel, message)
      debbug('log: ' + channel + ' ' + message)
    })

    r.on("permissions", (channel, message) => {
      socket.emit(channel, message)
      debbug('log: ' + channel + ' ' + message)
    })

    r.on("maintenance", (channel, message) => {
      socket.emit(channel, message)
      debbug('log: ' + channel + ' ' + message)
    })

    socket.on("isTyping", (message) => {
      io.emit("isTyping", message)
      debbug('log: id: ' + socket.id + ' - ' + message)
    })

    socket.on("delmessage", (channel, message) => {
      socket.emit(channel, message)
      debbug('log: ' + message)
    })

    socket.on("editmessage", (channel, message) => {
      socket.emit(channel, message)
      debbug('log: ' + message)
    })

    socket.on("online", (message) => {
      socket.emit(channel, message)
      debbug('log: ' + message)
    })

    socket.on('disconnect',  () => {
      if (numUsers !== 0) {
        --numUsers
        r.quit()
      }
      debbug('Client desconected id: ' + socket.id)
    })

  })
}