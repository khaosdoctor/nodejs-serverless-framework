function countCorrectAnswers(name, answers) {
  const correctAnswers = [3, 1, 0, 2]
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
  return result
}

module.exports = {
  countCorrectAnswers
}
