const pool = require('../../database')

async function GetParticularAppointment(req, res) {
  try {
    const appointment = await pool.query(
      'Select * from Appointment where id=$1',
      [req.body.id],
    )
    if (appointment.rows.length) {
      if (
        req.body.users.id === appointment.rows[0].user_id ||
        req.body.users.id === appointment.rows[0].doc_id
      ) {
        res.json(appointment.rows[0])
      } else {
        throw new Error('Unauthorized to access information')
      }
    } else res.json({ error: 'Not a Valid Appointment' })
  } catch (e) {
    res.json({ error: e.message })
  }
}
module.exports = GetParticularAppointment
