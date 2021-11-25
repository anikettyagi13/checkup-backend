const pool = require('../../database')

const availability = async (req, res) => {
  try {
    const k = await pool.query('SELECT * from Availability where(user_id=$1)', [
      req.body.users.id,
    ])
    res.json(k.rows)
  } catch (e) {
    console.log(e)
    res.json({ error: 'Not able to fetch Availability list' })
  }
}

const add_availability = async (req, res) => {
  try {
    const l = await pool.query(
      'SELECT * from Availability where(user_id=$1 AND doc_id=$2)',
      [req.body.users.id, req.body.doc_id],
    )
    if (l.rows.length > 0) return
    const k = await pool.query(
      'Insert into Availability(user_id, doc_id) values($1, $2)',
      [req.body.users.id, req.body.doc_id],
    )
    res.json({ success: 'BOOKED' })
  } catch (e) {
    res.json({ error: 'Not able to add to avalability' })
  }
}
const deleteAvailbility = async (req, res) => {
  try {
    if (req.body.users.id === req.body.avail.user_id) {
      await pool.query(
        'Delete from Availability where user_id=$1 AND doc_id=$2',
        [req.body.avail.user_id, req.body.avail.doc_id],
      )
      res.json({ success: 'Success' })
    } else {
      res.json({ error: 'unauthorized' })
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'Unable to delete!' })
  }
}

module.exports = { availability, add_availability, deleteAvailbility }
