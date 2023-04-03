const Alert = new customAlert('#alerts')

const form = document.querySelector('form')

const saveBtn = document.querySelector('#saveBtn')

const nameText = document.querySelector('#nameText')
const emailText = document.querySelector('#emailText')

const email = document.querySelector('#email')

const currentPassword = document.querySelector('#currentPassword')
const newPassword = document.querySelector('#newPassword')

const mainAccount = async () => {
  const account = await (await fetch('/api/me')).json()

  console.log(account)

  nameText.innerHTML = account.account.name
  emailText.innerHTML = account.account.email

  email.value = account.account.email
}

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

  fetch(url, fetchOptions).then((response) => {
    if (response.status == 200) {
      Alert.success('Account updated')
    } else {
      response.json().then((data) => {
        Alert.error(data.error)
      })
    }
  })
})

mainAccount()
