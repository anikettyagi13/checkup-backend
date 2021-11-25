const pool = require('../../database')

async function update(req, res) {
  try {
    console.log(req.body)
    if (req.body.type === 'doctor') await updateDoctor(req, res)
    if (req.body.type === 'patient') await updatePatient(req, res)
  } catch (e) {
    console.log(e)
    res.json(e)
    return
  }
}
async function updateDoctor(req, res) {
  try {
    const doc = await pool.query('SELECT * from DocInfo where id=$1', [
      req.body.user.id,
    ])
    const {
      id,
      email,
      name,
      bio,
      timeing,
      days,
      treatment1,
      treatment2,
      treatment3,
      treatment4,
      degrees,
      profile,
      cover,
      hospital,
      fees,
    } = req.body.user
    if (doc.rows.length > 0) {
      const doc = await pool.query(
        'UPDATE DocInfo set bio=$1, timeing=$2, days=$3, treatment1=$4, treatment2=$5, treatment3=$6, treatment4=$7, degrees=$8, profile=$9, cover=$10, hospital=$11, fees=$12 where id=$13',
        [
          bio,
          timeing,
          days,
          treatment1,
          treatment2,
          treatment3,
          treatment4,
          degrees,
          profile,
          cover,
          hospital,
          fees,
          id,
        ],
      )
      return
    } else {
      const doc = await pool.query(
        'INSERT into DocInfo(id, email, name, bio, timeing, days, treatment1, treatment2, treatment3, treatment4, degrees, profile, cover, hospital, fees, type, patients_treated) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
        [
          id,
          email,
          name,
          bio,
          timeing,
          days,
          treatment1,
          treatment2,
          treatment3,
          treatment4,
          degrees,
          profile,
          cover,
          hospital,
          fees,
          'doctor',
          0,
        ],
      )
      return
    }
  } catch (e) {
    console.log(e)
    res.json(e)
  }
}

async function updatePatient(req, res) {
  try {
    const doc = await pool.query('SELECT * from PatientInfo where id=$1', [
      req.body.user.id,
    ])
    const { id, email, name, profile, cover } = req.body.user
    if (doc.rows.length > 0) {
      const doc = await pool.query(
        'UPDATE PatientInfo set profile=$1, cover=$2 where id=$3',
        [profile, cover, id],
      )
      return
    } else {
      const doc = await pool.query(
        'INSERT into PatientInfo(id, email, name, profile, cover, type) values($1, $2, $3, $4, $5, $6)',
        [id, email, name, profile, cover, req.body.type],
      )
      return
    }
  } catch (e) {
    console.log(e)
    res.json(e)
  }
}

module.exports = update
