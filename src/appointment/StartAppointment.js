const pool = require('../../database')

async function StartAppointment(req, res, users) {
  try {
    const appointment = await pool.query(
      'Select * from Appointment where id=$1',
      [req.body.appointment],
    )
    if (req.body.users.type === 'patient') {
      if (appointment.rows[0].user_id === req.body.users.id) {
        await pool.query('Update Appointment set userjoined=$1 where id=$2', [
          true,
          req.body.appointment,
        ])
        if (users[appointment.rows[0].doc_id]) {
          users[appointment.rows[0].doc_id].emit('notification', {
            message: `${req.body.users.name} Joined the Appointment  "Join Now"`,
            action: {
              pathName: `/appointment/${appointment.rows[0].id}`,
              title: 'JOIN NOW',
            },
          })
        }
        res.json({ success: 'Joined' })
      } else throw new Error()
    } else {
      if (appointment.rows[0].doc_id === req.body.users.id) {
        await pool.query(
          'Update Appointment set start=$1, docJoined=$2 where id=$3',
          [true, true, req.body.appointment],
        )
        if (users[appointment.rows[0].user_id]) {
          users[appointment.rows[0].user_id].emit('notification', {
            message: `Appointment with ${req.body.users.name} started Join Now`,
            action: {
              pathName: `/appointment/${appointment.rows[0].id}`,
              title: 'JOIN NOW',
            },
          })
        }
        res.json({ success: 'Started' })
      } else throw new Error()
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'Some Error Occured!' })
  }
}

module.exports = StartAppointment
