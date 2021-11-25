const express = require('express')
const bodyParser = require('body-parser')
const register = require('./src/signup/signup')
const login = require('./src/login/login')
const app = express()
const cors = require('cors')
const { isLoggedIn } = require('./src/utils/utils')
const update = require('./src/profile/update')
const userInfo1 = require('./src/profile/userInfo')
const { history, getHistory } = require('./src/profile/history')
const {
  availability,
  add_availability,
  deleteAvailbility,
} = require('./src/profile/availability')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.json())
app.use(express.text())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    // origin: 'https://checkuphospital.azurewebsites.net',
    origin: 'http://localhost:3000',

    credentials: true,
  },
  // transports: ['websocket'],
  upgrade: true,
})
const {
  GetAppointment,
  GetPreviousAppointment,
} = require('./src/appointment/GetAppointment')
const createAppointment = require('./src/appointment/CreateAppointment')
const getCommunicationId = require('./src/communication/getCommunicationId')
const GetParticularAppointment = require('./src/appointment/GetParticularAppointment')
const { createDecipher } = require('crypto')
const StartAppointment = require('./src/appointment/StartAppointment')
const JoinAppointment = require('./src/appointment/JoinAppointment')
const CreateNotification = require('./src/utils/CreateNotification')
const EndCall = require('./src/appointment/EndCall')
const getSearchHistory = require('./src/search/History')
const Search = require('./src/search/Search')
const pool = require('./database')
const getKeys = require('./src/utils/getkey')
const createCommunicationId = require('./src/communication/createCommunicationId')
const users = {}

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  await login(email, password, res)
})
app.post('/signup', async (req, res) => {
  try {
    await register(req, res)
  } catch (e) {
    res.json({ error: e })
  }
})
app.get('/', async (req, res) => {
  try {
    res.json({ success: true })
  } catch (e) {
    res.json({ error: e })
  }
})
app.post('/api', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error(req.body.error)
    res.json({
      type: req.body.users.type,
      user: req.body.users,
    })
  } catch (e) {
    res.json({ error: e })
  }
})

app.get('/api/profile/:id', async (req, res) => {
  await userInfo1(req.params.id, res)
})

app.post('/api/update_profile', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error(req.body.error)
    else update(req, res)
    res.json()
  } catch (e) {
    res.json({ error: e })
  }
})

app.post('/api/delete_availability', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error(req.body.error)
    await deleteAvailbility(req, res)
  } catch (e) {
    res.json({ error: e })
  }
})

app.post('/api/get_availability', isLoggedIn, async (req, res) => {
  try {
    await availability(req, res)
  } catch (e) {
    res.json({ error: 'Unauthorized' })
  }
})
app.post('/api/add_availability', isLoggedIn, async (req, res) => {
  try {
    await add_availability(req, res)
  } catch (e) {
    res.json({ error: 'unable to add!' })
  }
})

app.post('/api/get_communication_id', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await getCommunicationId(req, res)
  } catch (e) {
    res.json({ error: 'Unauthorized to access communication token' })
  }
})

app.post('/api/create_history', isLoggedIn, async (req, res) => {
  try {
    await history(req, res)
  } catch (e) {
    res.json({ error: 'Not logged in' })
  }
})

app.post('/api/create_appointment', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await createAppointment(req, res, users)
  } catch (e) {
    res.json({ error: 'unauthorized' })
  }
})

app.post('/api/get_appointment', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await GetAppointment(req, res)
  } catch (e) {
    res.json({ error: 'unauthorized' })
  }
})
app.post('/api/get_appointment_info', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await GetParticularAppointment(req, res)
  } catch (e) {
    res.json({ error: 'unauthorized' })
  }
})
app.post('/api/get_previous_appointment', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await GetPreviousAppointment(req, res)
  } catch (e) {
    res.json({ error: 'unauthorized' })
  }
})
app.post('/api/start_appointment', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await StartAppointment(req, res, users)
  } catch (e) {
    res.json({ error: 'unauthorized' })
  }
})
app.post('/api/end_call', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await EndCall(req, res)
  } catch (e) {
    res.json({ error: 'Unauthenticated' })
  }
})

app.post('/api/history', async (req, res) => {
  await getHistory(req, res)
})
app.post('/api/create_notification', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await CreateNotification(req, res, users)
  } catch (e) {
    res.json({ error: 'Unauthorized' })
  }
})
app.post('/api/getSearchHistory', isLoggedIn, async (req, res) => {
  try {
    if (req.body.error) throw new Error()
    await getSearchHistory(req, res)
  } catch (e) {
    console.log(e)
    res.json({ error: 'Unauthenticated' })
  }
})
app.post('/api/search', isLoggedIn, async (req, res) => {
  await Search(req, res)
})
io.on('connect', (socket) => {
  socket.on('new_id', (data) => {
    if (data.user && data.user.id) {
      users[data.user.id] = socket
      JoinAppointment(users, data.user)
      console.log('user new')
    }
  })
  socket.on('user_removed', (data) => {
    if (data.user && data.user.id) {
      users[data.user.id] = 0
      console.log('user new removed')
    }
  })
})
require('dotenv').config()

server.listen(process.env.port || process.env.PORT || 80, async () => {
  console.log('yo')
})
