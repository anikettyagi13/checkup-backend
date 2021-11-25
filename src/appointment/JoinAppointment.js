const pool = require('../../database')

async function JoinAppointment(users, user) {
  try {
    let appointment = {}
    let time = new Date().getTime()
    if (user.type === 'doctor') {
      appointment = await pool.query(
        'Select * from Appointment where doc_id=$1 AND timestamp>$2 AND timestamp<$3 AND start=$4',
        [user.id, time, time + 1800000, true],
      )
    } else if (user.type === 'patient') {
      appointment = await pool.query(
        'Select * from Appointment where user_id=$1 AND timestamp>$2 AND timestamp<$3 AND start=$4',
        [user.id, time, time + 1800000, true],
      )
    }
    if (appointment.rows.length) {
      if (user.type === 'patient' && appointment.rows[0].userjoined) {
        return
      } else if (user.type === 'doctor') {
        return
      }
      users[user.id].emit('notification', {
        message: 'Appointment Started!',
        action: {
          pathName: `/appointment/${appointment.rows[0].id}`,
          title: 'JOIN NOW',
        },
      })
    }
  } catch (e) {
    console.log(e)
  }
}
module.exports = JoinAppointment
