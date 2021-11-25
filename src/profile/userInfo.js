const pool = require('../../database')
const getUserInfo = require('../utils/users')
const userInfo1 = async (id, res) => {
  try {
    const user = await pool.query('SELECT * from users where id=$1', [id])
    if (user.rows.length == 0)
      res.json({ error: 'no user found! Please check the url carefully.' })
    const userInfo = await getUserInfo(user.rows[0].type, user.rows[0].id)
    if (userInfo.rows.length == 0) {
      res.json({ error: 'no user found!' })
    } else
      res.json({
        type: userInfo.rows[0].type,
        user: userInfo.rows[0],
      })
  } catch (e) {
    res.json({ error: e.message })
  }
}

module.exports = userInfo1
