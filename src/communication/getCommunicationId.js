const pool = require('../../database')
const createCommunicationId = require('./createCommunicationId')

async function getCommunicationId(req, res) {
  try {
    let communicationToken = {}
    let id = req.body.id
    communicationToken = await pool.query(
      'Select * from communicationToken where(user_id =$1)',
      [id],
    )
    if (
      communicationToken.rows.length === 0 ||
      communicationToken.rows[0].expires_on < new Date().getTime() + 3600000
    ) {
      let { token, expiresOn, communicationuserid } =
        await createCommunicationId(communicationToken.rows, id)
      res.json({
        token: {
          token,
          expiresOn,
          communicationuserid,
        },
      })
    } else {
      res.json({ token: communicationToken.rows[0] })
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'unable to get communication service' })
  }
}

module.exports = getCommunicationId
