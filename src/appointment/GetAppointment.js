const pool = require('../../database')

async function GetAppointment(req, res) {
  try {
    if (req.body.doc_id) {
      const d = new Date()
      d.setDate(d.getDate() + 3)
      const appointments = await pool.query(
        'SELECT * from Appointment where(timestamp>=$1 AND timestamp<=$2 AND doc_id=$3 AND ended=$4) order by timestamp',
        [req.body.timestamp, d.getTime(), req.body.doc_id, false],
      )
      res.json({ bookings: appointments.rows })
    } else {
      const d = new Date()
      d.setDate(d.getDate() + 3)
      const appointments = await pool.query(
        'SELECT * from Appointment where(timestamp>=$1 AND timestamp<=$2 AND user_id=$3 AND ended=$4) order by timestamp',
        [req.body.timestamp, d.getTime(), req.body.user_id, false],
      )
      res.json({ bookings: appointments.rows })
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'Error! Unable to retrieve information' })
  }
}

async function GetPreviousAppointment(req, res) {
  try {
    if (req.body.doc_id) {
      const appointments = await pool.query(
        'SELECT * from Appointment where(((timestamp<$1) AND doc_id=$2) OR (ended=$3 AND doc_id=$4)) order by timestamp desc limit 10',
        [req.body.lowerstamp, req.body.doc_id, true, req.body.doc_id],
      )
      res.json({ bookings: appointments.rows })
    } else {
      const appointments = await pool.query(
        'SELECT * from Appointment where(((timestamp<$1) AND user_id=$2) OR (ended=$3 AND user_id=$4)) order by timestamp desc limit 10',
        [req.body.lowerstamp, req.body.user_id, true, req.body.user_id],
      )
      res.json({ bookings: appointments.rows })
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'Error! Unable to retrieve information' })
  }
}

module.exports = { GetAppointment, GetPreviousAppointment }
