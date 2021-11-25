const pool = require('../../database')
async function getUserInfo(type, id) {
  try {
    let users = {}
    if (type === 'doctor') {
      users = await pool.query('Select * from DocInfo where id=$1', [id])
    } else {
      users = await pool.query('Select * from PatientInfo where id=$1', [id])
    }
    return users
  } catch (e) {
    console.log(e)
  }
}

module.exports = getUserInfo
