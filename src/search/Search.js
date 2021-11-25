const pool = require('../../database')
const { MakeHistory } = require('./MakeHistory')

async function Search(req, res) {
  try {
    console.log(req.body.search)
    const search = await pool.query(
      'Select name, id, profile, bio, treatment1, treatment2, treatment3, treatment4, hospital, fees from DocInfo where treatment1=$1 OR treatment2=$1 OR treatment3=$1 OR treatment4=$1',
      [req.body.search],
    )
    if (req.body.users) {
      await MakeHistory(req.body.users.id, req.body.search)
    }
    res.json({ result: search.rows })
  } catch (e) {
    console.log(e)
    req.json({ error: 'Search Result Not Found' })
  }
}
module.exports = Search
