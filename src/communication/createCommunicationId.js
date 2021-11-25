const { CommunicationIdentityClient } = require('@azure/communication-identity')
const pool = require('../../database')
const { getKeys } = require('../utils/getkey')

const createCommunicationId = async (communication, id) => {
  const connectionString = await getKeys()
  const identityClient = new CommunicationIdentityClient(connectionString)

  if (communication.length > 0) {
    const { token, expiresOn, identityResponse } = await getNewToken(
      communication[0],
      identityClient,
    )
    communicationuserid = identityResponse.communicationUserId
    await pool.query(
      'Update communicationToken set token=$1, expires_on=$2 where user_id=$3',
      [token, expiresOn, id],
    )
    return { token, expiresOn, communicationuserid }
  } else {
    const { token, expiresOn, identityResponse } = await getNewUser(
      identityClient,
    )
    communicationuserid = identityResponse.communicationUserId
    await pool.query(
      'Insert into communicationToken( user_id, token, expires_on, communicationuserid) values($1, $2, $3, $4)',
      [id, token, expiresOn, communicationuserid],
    )
    return { token, expiresOn, communicationuserid }
  }
}

const getNewToken = async (communicationToken, identityClient) => {
  const identityResponse = {
    communicationUserId: communicationToken.communicationuserid,
  }
  const { token, expiresOn } = await createNewToken(
    identityResponse,
    identityClient,
  )
  return { token, expiresOn, identityResponse }
}
const getNewUser = async (identityClient) => {
  let identityResponse = await identityClient.createUser()
  const { token, expiresOn } = await createNewToken(
    identityResponse,
    identityClient,
  )
  return { token, expiresOn, identityResponse }
}

const createNewToken = async (identityResponse, identityClient) => {
  let tokenResponse = await identityClient.getToken(identityResponse, ['voip'])
  let { token, expiresOn } = tokenResponse
  expiresOn = new Date(expiresOn).getTime()
  return { token, expiresOn }
}

module.exports = createCommunicationId
