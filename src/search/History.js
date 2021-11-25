const pool = require('../../database')

async function getSearchHistory(req, res) {
  try {
    const history = await pool.query(
      'Select * from SearchHistory where user_id=$1 order by timestamp desc limit 10',
      [req.body.users.id],
    )
    res.json({ history: history.rows })
  } catch (e) {
    console.log(e)
    res.json('Error! while retrieving Search History')
  }
}

module.exports = getSearchHistory
