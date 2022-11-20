const $ = document.querySelector.bind(document)

$('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = {
    answers: []
  }

  data.name = $('input[name="student-name"').value
  if (data.name === '') {
    alert('Por favor, preencha o nome do aluno')
    return
  }

  const selectedAnswers = document.querySelectorAll('input[type="radio"]:checked')

  if (selectedAnswers.length !== 4) {
    alert('Você não respondeu todas as perguntas')
    return
  }

  selectedAnswers.forEach((answer) => {
    data.answers[Number(answer.name) - 1] = Number(answer.value)
  })

  const response = await fetch('/api/results', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const { __hypermedia } = await response.json()

    window.location = new URL(
      __hypermedia.href + '?' + new URLSearchParams(__hypermedia.query).toString(),
      window.location
    ).toString()
  }
})
