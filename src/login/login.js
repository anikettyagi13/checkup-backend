const bcrypt = require('bcryptjs')
const pool = require('../../database')
const jwt = require('jsonwebtoken')
const getUserInfo = require('../utils/users')

const login = async (email, password, res) => {
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  if (user.rows.length == 0) {
    return res.json({
      error: 'No user with these credentials found.',
    })
  } else {
    bcrypt.hash(password, user.rows[0].salt, (err, hash) => {
      if (err) {
        return res.json({
          error: 'We are not able to log you in, please try again later..',
        })
      } else {
        if (hash == user.rows[0].hash) {
          jwt.sign(
            { password: password },
            '$2a$10$.35wejE4Ovk69/8BmljGHO',
            async function (err, token) {
              if (err) {
                return res.json({
                  error: 'Sorry, We could not log you in, try after some time.',
                })
              } else {
                try {
                  const tok = [...user.rows[0].token, token]
                  pool
                    .query('UPDATE users SET token = $1 WHERE email =$2 ', [
                      tok,
                      email,
                    ])
                    .then(async (response, err) => {
                      if (err) throw new Error('asdf')
                      const users = await getUserInfo(
                        user.rows[0].type,
                        user.rows[0].id,
                      )
                      const k =
                        users.rows && users.rows[0]
                          ? users.rows[0]
                          : {
                              name: user.rows[0].name,
                              email: user.rows[0].email,
                              type: user.rows[0].type,
                              id: user.rows[0].id,
                            }
                      console.log(k)
                      res.json({
                        id: user.rows[0].id,
                        token: token,
                        type: user.rows[0].type,
                        user: k,
                      })
                    })
                } catch (e) {
                  return res.json({
                    error:
                      'Sorry, We could not log you in, try after some time.',
                  })
                }
              }
            },
          )
        } else {
          res.json({
            error: 'Incorrect Password',
          })
        }
      }
    })
  }
}

module.exports = login
