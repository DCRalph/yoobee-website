const accountMenuButton = document.querySelector('#account-menu-button')
const accountMenu = document.querySelector('#account-menu')

const cartNumber = document.querySelector('#cart-number')

let accountMenuOpen = false

accountMenuButton.addEventListener('click', async () => {
  accountMenuOpen = !accountMenuOpen

  // Entering: "transition ease-out duration-100"
  //   From: "transform opacity-0 scale-95"
  //   To: "transform opacity-100 scale-100"

  // Leaving: "transition ease-in duration-75"
  //   From: "transform opacity-100 scale-100"
  //   To: "transform opacity-0 scale-95"

  if (accountMenuOpen) {
    accountMenu.classList.remove('hidden')

    await new Promise((res) => setTimeout(res, 0))

    accountMenu.classList.remove('transition', 'ease-in', 'duration-75')
    accountMenu.classList.add('transition', 'ease-out', 'duration-100')

    accountMenu.classList.remove('transform', 'opacity-0', 'scale-75')
    accountMenu.classList.add('transform', 'opacity-100', 'scale-100')
  } else {
    accountMenu.classList.remove('transition', 'ease-out', 'duration-100')
    accountMenu.classList.add('transition', 'ease-in', 'duration-75')

    accountMenu.classList.remove('transform', 'opacity-100', 'scale-100')
    accountMenu.classList.add('transform', 'opacity-0', 'scale-75')

    setTimeout(() => {
      accountMenu.classList.add('hidden')
    }, 200)
  }
})

const makeAccountDropdown = (logedIn) => {
  let a

  if (logedIn) {
    a = document.createElement('a')
    a.href = '/api/logout'
    a.innerHTML = 'Logout'
    a.classList.add(
      'flex',
      'rounded-lg',
      'px-4',
      'py-2',
      'text-sm',
      'text-white',
      'bg-red-600',
      'hover:bg-red-700'
    )

    accountMenu.appendChild(a)

    a = document.createElement('a')
    a.href = '/account'
    a.innerHTML = 'Account'
    a.classList.add(
      'flex',
      'rounded-lg',
      'px-4',
      'py-2',
      'text-sm',
      'text-black',
      'bg-gray-200',
      'hover:bg-gray-300'
    )

    accountMenu.appendChild(a)
  } else {
    a = document.createElement('a')
    a.href = '/login'
    a.innerHTML = 'Login'
    a.classList.add(
      'flex',
      'rounded-lg',
      'px-4',
      'py-2',
      'text-sm',
      'text-black',
      'bg-gray-200',
      'hover:bg-gray-300'
    )

    accountMenu.appendChild(a)

    a = document.createElement('a')
    a.href = '/register'
    a.innerHTML = 'Register'
    a.classList.add(
      'flex',
      'rounded-lg',
      'px-4',
      'py-2',
      'text-sm',
      'text-black',
      'bg-gray-200',
      'hover:bg-gray-300'
    )

    accountMenu.appendChild(a)
  }
}

const updateCartNumber = (number) => {
  cartNumber.innerHTML = number
}

const main = async () => {
  let userData = fetch('/api/me')
  let userCart = fetch('/api/cart')

  const allUserData = await Promise.allSettled([userData, userCart])
  console.log(allUserData[0], allUserData[1])

  if (
    allUserData[0].status !== 'fulfilled' ||
    allUserData[1].status !== 'fulfilled'
  ) {
    alert('Error')
    window.location.reload()
    return
  }

  const dataToJson = await Promise.allSettled(
    allUserData.map((data) => data.value.json())
  )
  userData = dataToJson[0].value
  userCart = dataToJson[1].value

  console.log(userData, userCart)

  makeAccountDropdown(userData.logedIn)

  updateCartNumber(userCart.length)
}

main()
