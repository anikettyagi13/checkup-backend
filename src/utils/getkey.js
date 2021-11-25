var KeyVault = require('azure-keyvault')
var AuthenticationContext = require('adal-node').AuthenticationContext

var clientId = '71124de9-44f8-44f6-9ca8-910018791a6e'
var clientSecret = '3JH7Q~yg9~SBjeGdzZNv.QuFKsvXe0XjiZqXc'
var vaultUri = 'https://hospitalapp.vault.azure.net/'

// Authenticator - retrieves the access token
var authenticator = function (challenge, callback) {
  // Create a new authentication context.
  var context = new AuthenticationContext(challenge.authorization)

  // Use the context to acquire an authentication token.
  return context.acquireTokenWithClientCredentials(
    challenge.resource,
    clientId,
    clientSecret,
    function (err, tokenResponse) {
      if (err) throw err
      // Calculate the value to be set in the request's Authorization header and resume the call.
      var authorizationValue =
        tokenResponse.tokenType + ' ' + tokenResponse.accessToken

      return callback(null, authorizationValue)
    },
  )
}

const getKeys = async () => {
  var credentials = new KeyVault.KeyVaultCredentials(authenticator)
  var client = new KeyVault.KeyVaultClient(credentials)

  let secretName = 'communicationstring'
  secretVersion = '' //leave this blank to get the latest version;
  return await client.getSecret(vaultUri, secretName, secretVersion)
}
const getDatabasePassword = async () => {
  var credentials = new KeyVault.KeyVaultCredentials(authenticator)
  var client = new KeyVault.KeyVaultClient(credentials)

  let secretName = 'communicationstring'
  secretVersion = '' //leave this blank to get the latest version;
  return await client.getSecret(vaultUri, secretName, secretVersion)
}

module.exports = { getKeys, getDatabasePassword }
