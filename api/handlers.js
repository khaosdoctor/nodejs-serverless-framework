'use strict'
const { MongoClient, ObjectId } = require('mongodb')

async function connectToDatabase() {
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

module.exports.sendResponse = async (event) => {
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
