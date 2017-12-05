import { setTimeout } from 'timers'

export const command = crazy => {
  const { io, rl, users, debbug } = crazy
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

      /**
       * Maintenance
       */
      if(line.indexOf('/down') == 0) {
        debbug('Maintenance server down.')
        let select = line.substring(5)
        let date = select.split('date:')
        let d = date[1].split(' ')
        let m = select.split('message:')
        
        if (d[0] && m[1]) {
          setTimeout(() => { io.emit('down', {date: d[0], message: m[1]}) }, 1000)
        }
        else {
          debbug('🔥  Error, u need add date:time message:message.')
        }
      }
      if(line.indexOf('/up') == 0) {
        debbug('Server up.')
        setTimeout(() => { io.emit('up', true) }, 1000)
      }

    }).on('close', () => {
      debbug('stop Shutting down')
      process.exit(0)
  })
}
