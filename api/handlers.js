'use strict'
const { pbkdf2Sync } = require('crypto')
const { MongoClient, ObjectId } = require('mongodb')

const connectionInstance = null
async function connectToDatabase() {
  if (connectionInstance) return connectionInstance
  const client = new MongoClient(process.env.MONGODB_CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const connection = await client.connect()
  return connection.db(process.env.MONGODB_DB_NAME)
}

function extractBody(event) {
  if (!event?.body) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error: 'Missing body' })
    }
  }

  return JSON.parse(event.body)
}

async function basicAuth(event) {
  const { authorization } = event.headers
  if (!authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Missing authorization header' })
    }
  }

  const [type, credentials] = authorization.split(' ')
  if (type !== 'Basic') {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid authorization type' })
    }
  }

  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')
  const hashedPass = pbkdf2Sync(password, process.env.SALT, 100000, 64, 'sha512').toString('hex')

  const client = await connectToDatabase()
  const collection = client.collection('users')
  const user = await collection.findOne({ name: username, password: hashedPass })

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid credentials' })
    }
  }

  return {
    id: user._id,
    username: user.username
  }
}

module.exports.sendResponse = async (event) => {
  const authResult = await basicAuth(event)
  if (authResult.statusCode === 401) return authResult

  const correctAnswers = [3, 1, 0, 2]
  const { name, answers } = extractBody(event)
  const totalCorrectAnswers = answers.reduce((acc, answer, index) => {
    if (answer === correctAnswers[index]) acc++
    return acc
  }, 0)

  const result = {
    name,
    answers,
    totalCorrectAnswers,
    totalAnswers: answers.length
  }

  const client = await connectToDatabase()
  const collection = client.collection('results')
  const { insertedId } = await collection.insertOne(result)

  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      resultId: insertedId,
      __hypermedia: {
        href: `/results.html`,
        query: { id: insertedId }
      }
    })
  }
}

module.exports.getResult = async (event) => {
  const authResult = await basicAuth(event)
  if (authResult.statusCode === 401) return authResult

  const client = await connectToDatabase()
  const collection = client.collection('results')
  const result = await collection.findOne({ _id: new ObjectId(event.pathParameters.id) })
  if (!result) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Result not found' })
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  }
}
