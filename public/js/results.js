const queryString = new URLSearchParams(window.location.search)
const resultId = queryString.get('id')

const bail = () => {
  alert('Nenhum resultado encontrado')
  // window.location = '/'
}

if (!resultId) bail()

fetch(`/api/results/${resultId}`)
  .then((r) => {
    if (!r.ok) bail()
    return r.json()
  })
  .then(({ result }) => {
    document.getElementById('student-name').innerText = result.name
    document.getElementById('correct').innerText = result.correctAnswers
  })
  .catch((e) => {
    console.error(e)
    bail()
  })
