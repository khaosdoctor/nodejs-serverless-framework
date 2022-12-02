import { randomUUID } from 'crypto'
import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))

const correctQuestions = [3, 1, 0, 2]
const previousResults = new Map()

app.use(express.json())
app.post('/api/results', (req, res) => {
  const { name, answers } = req.body
  const correctAnswers = answers.reduce((acc, answer, index) => {
    if (answer === correctQuestions[index]) {
      acc++
    }
    return acc
  }, 0)

  const result = {
    name,
    correctAnswers,
    totalAnswers: answers.length
  }

  const resultId = randomUUID()
  previousResults.set(resultId, { response: req.body, result })
  console.log(previousResults)
  res.status(201).json({
    resultId,
    __hypermedia: {
      href: `/results.html`,
      query: { id: resultId }
    }
  })
})

app.get('/api/results/:id', (req, res) => {
  const result = previousResults.get(req.params.id)
  if (!result) {
    return res.status(404).json({ error: 'Result not found' })
  }
  res.json(result)
})

app.use(express.static(join(__dirname, 'interface')))
app.listen(process.env.PORT || 3000, () => {
  console.log('Server started')
})
