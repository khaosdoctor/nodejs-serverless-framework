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

async function getUserByCredentials(username, password) {
  const client = await connectToDatabase()
  const collection = client.collection('users')
  const user = await collection.findOne({ name: username, password: password })
  if (!user) return null
  return user
}

async function saveResultToDatabase(result) {
  const client = await connectToDatabase()
  const collection = client.collection('results')
  const { insertedId } = await collection.insertOne(result)
  return insertedId
}

async function getResultById(id) {
  const client = await connectToDatabase()
  const collection = client.collection('results')
  const result = await collection.findOne({ _id: new ObjectId(id) })
  if (!result) return null
  return result
}

module.exports = {
  getUserByCredentials,
  saveResultToDatabase,
  getResultById
}
