'use strict'
const { authorize, createToken, makeHash } = require('./auth')
const { getResultById, getUserByCredentials, saveResultToDatabase } = require('./database')
const { buildResponse } = require('./utils')
const { countCorrectAnswers } = require('./responses')

function extractBody(event) {
  if (!event?.body) {
    return buildResponse(422, { error: 'Missing body' })
  }

  return JSON.parse(event.body)
}

module.exports.login = async (event) => {
  const { username, password } = extractBody(event)
  const hashedPass = makeHash(password)

  const user = await getUserByCredentials(username, hashedPass)

  if (!user) {
    return buildResponse(401, { error: 'Invalid username or password' })
  }

  return buildResponse(200, { token: createToken(username, user._id) })
}

module.exports.sendResponse = async (event) => {
  const authResult = await authorize(event.headers.authorization)
  if (authResult.statusCode === 401) return authResult

  const { name, answers } = extractBody(event)
  const result = countCorrectAnswers(name, answers)
  const insertedId = await saveResultToDatabase(result)

  return buildResponse(201, {
    resultId: insertedId,
    __hypermedia: { href: '/results.html', query: { id: insertedId } }
  })
}

module.exports.getResult = async (event) => {
  const authResult = await authorize(event.headers.authorization)
  if (authResult.statusCode === 401) return authResult

  const result = await getResultById(event.pathParameters.id)
  if (!result) {
    return buildResponse(404, { error: 'Result not found' })
  }

  return buildResponse(200, result)
}
