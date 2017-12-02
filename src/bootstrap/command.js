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
    }).on('close', () => {
      debbug('stop Shutting down')
      process.exit(0)
  })
}
