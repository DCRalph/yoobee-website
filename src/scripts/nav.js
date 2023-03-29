const userMenuButton = document.querySelector('#user-menu-button')
const profileMenu = document.querySelector('#profile-menu')

// let mobileMenuOpen = false
let profileOpen = false

// mobileMenuButton.addEventListener('click', () => {
//   mobileMenuOpen = !mobileMenuOpen

//   if (mobileMenuOpen) {
//     mobileMenu.classList.remove('hidden')
//     mobileMenuIcon.classList.add('hidden')
//     mobileXIcon.classList.remove('hidden')
//   } else {
//     mobileMenu.classList.add('hidden')
//     mobileMenuIcon.classList.remove('hidden')
//     mobileXIcon.classList.add('hidden')
//   }
// })

userMenuButton.addEventListener('click', async () => {
  profileOpen = !profileOpen

  // Entering: "transition ease-out duration-100"
  //   From: "transform opacity-0 scale-95"
  //   To: "transform opacity-100 scale-100"

  // Leaving: "transition ease-in duration-75"
  //   From: "transform opacity-100 scale-100"
  //   To: "transform opacity-0 scale-95"

  if (profileOpen) {
    profileMenu.classList.remove('hidden')

    await new Promise((res) => setTimeout(res, 0))

    profileMenu.classList.remove('transition', 'ease-in', 'duration-75')
    profileMenu.classList.add('transition', 'ease-out', 'duration-100')

    profileMenu.classList.remove('transform', 'opacity-0', 'scale-75')
    profileMenu.classList.add('transform', 'opacity-100', 'scale-100')
  } else {
    profileMenu.classList.remove('transition', 'ease-out', 'duration-100')
    profileMenu.classList.add('transition', 'ease-in', 'duration-75')

    profileMenu.classList.remove('transform', 'opacity-100', 'scale-100')
    profileMenu.classList.add('transform', 'opacity-0', 'scale-75')

    setTimeout(() => {
      profileMenu.classList.add('hidden')
    }, 200)
  }
})

const getUserData = async () => {
  const res = await fetch('/api/me')
  if (res.status !== 200) return null
  const data = await res.json()

  return data
}

getUserData().then((data) => {
  let a

  if (data.logedIn) {
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

    profileMenu.appendChild(a)

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

    profileMenu.appendChild(a)
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

    profileMenu.appendChild(a)

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

    profileMenu.appendChild(a)

    // userIcon.children[0].src = data.avatar
    // userIcon.children[1].classList.add('hidden')
    // userIcon.children[0].classList.remove('hidden')
  }
})
