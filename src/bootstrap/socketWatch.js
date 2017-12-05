export const watch = (io, Redis, numUsers, st, debbug) => {

  io.on('connection', (socket) => {
    ++numUsers

    debbug(st.mag('User') + ' ' + st.gre('online') + ' ' + st.yel('id') + ': ' + st.red(socket.id)  + ' total online: ' + st.cya(numUsers))

    /**
    * Desconnect
    */
    socket.on('disconnect', async () => {
        if (numUsers !== 0) {
          --numUsers
          Redis.db.hdel('users', socket.user_id)
          let users = await Redis.db.hvalsAsync('users')
          io.emit('setOnlineUsers', users)
          // Redis.db.quit()
        }
        debbug(st.yel('User left socket-id: ' + socket.id + ' user-id: ' + socket.user_id))
    })

    socket.on('setUser', async (obj) => {
        if (socket.id !== null && socket.id !== obj.id && obj.id) {

          debbug(st.mag('User') + ', socket-id: ' + st.red(socket.id) + ' now is: ' + st.red(obj.id))

          if (!await Redis.db.hgetAsync('users', obj.id)) {

              socket.user_id = obj.id
              socket.userName = obj.name
              socket.avatar = obj.avatar
              socket.color_nick = obj.color_nick
              socket.isTyping = false
              socket.status = 1

              const USER_DATA = {
                id: socket.user_id,
                name: socket.userName,
                avatar: socket.avatar,
                color_nick: socket.color_nick,
                isTyping: socket.isTyping,
                status: Number(socket.status)
              }

              Redis.db.hset('users', socket.user_id, JSON.stringify(USER_DATA))
          }
          else {

            let user = JSON.parse(await Redis.db.hgetAsync('users', obj.id))
            socket.user_id = user.id
            socket.userName = user.name
            socket.avatar = user.avatar
            socket.color_nick = user.color_nick
            socket.isTyping = user.isTyping
            socket.status = user.status
          }

          let users = await Redis.db.hvalsAsync('users')
          socket.emit('setOnlineUsers', users)
        }
      })

      socket.on("messages", async (message) => {
        Redis.db.hset('messages:' + 'global', message.id, JSON.stringify(message))
        let messages = await Redis.db.hvalsAsync('messages:' + 'global')
        io.emit('setMessages', messages)
        debbug('log: new message: ' + message.id)
      })

      socket.on("getMessages", async (channel) => {
        let messages = await Redis.db.hvalsAsync('messages:' + channel)
        io.emit('setMessages', messages)
        debbug('log: List all Messages')
      })

      Redis.db.on("permissions", (channel, message) => {
        io.emit(channel, message)
        debbug('log: ' + channel + ' ' + message)
      })

      Redis.db.on("maintenance", (channel, message) => {
        socket.emit(channel, message)
        debbug('log: ' + channel + ' ' + message)
      })

      /**
       * Set Typing true or false
       */
      socket.on("setTyping", (obj) => {
        socket.isTyping = obj.isTyping
        let data = {user_id: socket.user_id, isTyping: socket.isTyping}
        io.emit('getTyping', data)
        debbug('log: ' + socket.userName + ' is typing ' + socket.isTyping)
      })

      socket.on("getOnlineUsers", async (channel) => {
        let users = await Redis.db.hvalsAsync('users')
        io.emit('setOnlineUsers', users)
        debbug('log: Sent list all users online to chat')
      })

      socket.on("setStatus", (obj) => {

        socket.status = obj.status

        Redis.db.hset('users', socket.user_id, JSON.stringify({
          id: socket.user_id,
          name: socket.userName,
          avatar: socket.avatar,
          color_nick: socket.color_nick,
          isTyping: socket.isTyping,
          status: socket.status
        }))

        let data = {user_id: socket.user_id, status: socket.status}

        io.emit('getStatus', data)
        debbug('log: User: ' + socket.userName + ' changed status to: ' + obj.status)
      })

      socket.on("online", (message) => {
        socket.emit(channel, message)
        debbug('log: ' + message)
      })
  })
}