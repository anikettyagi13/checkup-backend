const bcrypt = require('bcryptjs')
const pool = require('../../database')
const getUserInfo = require('./users')

const CreateSalt = (length) => {
  return bcrypt.genSaltSync(length)
}

const isLoggedIn = async (req, res, next) => {
  try {
    const tokens = req.body.session_id
    const token = tokens.split('!id@')[1]
    const id = tokens.split('!id@')[0]
    var k = 0
    const user = await pool.query('SELECT * FROM users WHERE id=$1', [id])
    if (user.rows.length > 0) {
      try {
        user.rows[0].token.map((to) => {
          if (to == token) {
            k = 1
          }
        })
        if (k == 1) {
          const users = await getUserInfo(user.rows[0].type, user.rows[0].id)
          req.body.users =
            users.rows && users.rows[0]
              ? users.rows[0]
              : {
                  name: user.rows[0].name,
                  email: user.rows[0].email,
                  type: user.rows[0].type,
                  id: user.rows[0].id,
                }
          next()
        } else {
          req.body.error = 'unauthorized'
          next()
        }
      } catch (e) {
        req.body.error = 'unauthorized'
        next()
      }
    } else {
      req.body.error = 'Cannot Retrieve user'
      next()
    }
  } catch (e) {
    req.body.error = 'Cannot Retrieve user'
    next()
  }
}

module.exports = {
  CreateSalt,
  isLoggedIn,
}
