const form = document.querySelector('form')

const saveBtn = document.querySelector('#saveBtn')

const nameText = document.querySelector('#nameText')
const emailText = document.querySelector('#emailText')

const email = document.querySelector('#email')

const currentPassword = document.querySelector('#currentPassword')
const newPassword = document.querySelector('#newPassword')

const main = async (account) => {
  console.log(account)

  nameText.innerHTML = account.name
  emailText.innerHTML = account.email

  email.value = account.email
}

fetch('/api/me').then(async (res) => {
  const json = await res.json()
  main(json)
})

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
      alert('ok')
    } else {
      response.json().then((data) => {
        alert(data.message)
      })
    }
  })
})
