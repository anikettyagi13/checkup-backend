const pool = require('../../database')

async function createAppointment(req, res, users) {
  try {
    const appointment = await pool.query(
      'INSERT INTO Appointment(user_id, doc_id, Subject, Id, StartTime, EndTime, Description,timestamp,start,ended,docjoined,userjoined) values($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$12)',
      [
        req.body.user_id,
        req.body.doc_id,
        req.body.Subject,
        req.body.Id,
        req.body.StartTime,
        req.body.EndTime,
        req.body.Description,
        req.body.timestamp,
        false,
        false,
        false,
        false,
      ],
    )
    console.log(users[req.body.doc_id])
    if (users[req.body.doc_id]) {
      users[req.body.doc_id].emit('notification', {
        message: `Appointed booked by ${req.body.users.name} for ${req.body.StartTime}`,
      })
    }
    res.json({
      user_id: req.body.user_id,
      doc_id: req.body.doc_id,
      Subject: req.body.Subject,
      Id: req.body.Id,
      StartTime: req.body.StartTime,
      EndTime: req.body.EndTime,
      Description: req.body.Description,
      timestamp: req.body.timestamp,
    })
  } catch (e) {
    console.log(e)
    res.json({ error: 'ERROR! Try Again Later' })
  }
}

module.exports = createAppointment
