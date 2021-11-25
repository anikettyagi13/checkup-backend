const pool = require('../../database')
async function history(req, res) {
  try {
    const u = await pool.query(
      'Insert into history(user_id, timestamp, link, name, info) values($1, $2, $3, $4, $5)',
      [
        req.body.user_id,
        req.body.timestamp,
        req.body.link,
        req.body.name,
        req.body.info,
      ],
    )
    res.json({ success: 'uploaded!' })
  } catch (e) {
    console.log(e)
    res.json({ error: 'Unable to upload' })
  }
}

async function getHistory(req, res) {
  try {
    const u = await pool.query(
      'SElECT * from Availability where(user_id=$1 and doc_id=$2)',
      [req.body.user_id, req.body.doc_id],
    )
    if (u.rows.length === 0 && req.body.user_id !== req.body.doc_id)
      res.json([])
    else {
      const history = await pool.query(
        'SELECT * from History where(user_id=$1) order by timestamp desc',
        [req.body.user_id],
      )
      console.log(history.rows)
      res.json(history.rows)
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'Unable to Retrieve!' })
  }
}

module.exports = { history, getHistory }
