async function CreateNotification(req, res, users) {
  try {
    const body = req.body
    if (users[body.to]) {
      users[body.to].emit('notification', body.message)
    } else {
      users[body.from].emit('notification', {
        message: 'User not currently online. Please Wait',
        info: true,
      })
    }
  } catch (e) {
    res.json({ error: 'Try Again Later' })
  }
}
module.exports = CreateNotification
