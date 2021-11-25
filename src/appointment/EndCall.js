const pool = require('../../database')

async function EndCall(req, res) {
  try {
    if (req.body.users.type === 'patient') {
      if (req.body.appointment.user_id === req.body.users.id) {
        endCall(req.body.appointment.id)
      }
    } else if (req.body.users.type === 'doctor') {
      if (req.body.appointment.doc_id === req.body.users.id) {
        endCall(req.body.appointment.id)
      }
    }
  } catch (e) {
    res.json({ error: 'ERROR!! while ending call' })
  }
}

async function endCall(notification) {
  await pool.query('update appointment set ended =$1 where id=$2', [
    true,
    notification,
  ])
}

module.exports = EndCall
