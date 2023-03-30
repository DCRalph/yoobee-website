import customAlert from './modules/alert.js'

const Alert = new customAlert('#alerts')

const form = document.querySelector('form')

const password = document.querySelector('#password')
const passwordConfirm = document.querySelector('#passwordConfirm')
const passwordNotMatch = document.querySelector('#password-not-match')

const checkPassword = () => {
  if (password.value != passwordConfirm.value && passwordConfirm.value != '') {
    passwordNotMatch.classList.remove('hidden')
  } else {
    passwordNotMatch.classList.add('hidden')
  }
}

password.addEventListener('change', checkPassword)
passwordConfirm.addEventListener('change', checkPassword)

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(form)
  const data = {}
  formData.forEach((value, key) => {
    data[key] = value
  })

  const url = form.getAttribute('action')
  const method = form.getAttribute('method')
  const body = JSON.stringify(data)
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const fetchOptions = {
    method,
    headers,
    body,
  }

  fetch(url, fetchOptions).then(async (response) => {
    if (response.status == 200) {
      Alert.success('Logged in successfully', -1)
      await new Promise((res) => setTimeout(res, 500))
      window.location.href = '/'
    } else {
      response.json().then((data) => {
        Alert.error(data.message)
      })
    }
  })
})
