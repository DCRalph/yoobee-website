const accountMenuButton = document.querySelector('#account-menu-button')
const accountMenu = document.querySelector('#account-menu')

const mobileMenuButton = document.querySelector('#mobile-menu-button')
const mobileMenuCloseButton = document.querySelector(
  '#mobile-menu-close-button'
)
const mobileMenu = document.querySelector('#mobile-menu')

const cartNumber = document.querySelector('#cart-number')
const cartButton = document.querySelector('#cart-btn')

const cartNumber2 = document.querySelector('#cart-number2')
const cartButton2 = document.querySelector('#cart-btn2')

const cartContent = document.querySelector('#cartContent')
const cartItems = document.querySelector('#cartItems')
const checkout = document.querySelector('#checkout')

const toTop = document.querySelector('#toTop')

let accountMenuOpen = false
let mobileMenuOpen = false
let cartOpen = false

let foodItemsList = []
let cart = []

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

const delCart = async (id) => {
  cart = cart.filter((item) => item.id !== id)

  await fetch('/api/cart/remove', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ foodId: id }),
  })

  let userCart = await (await fetch('/api/cart')).json()
  updateCart(userCart, foodItemsList)
}

const makeCartItem = (item, quantity) => {
  const div = document.createElement('div')
  div.classList.add(
    'h-12',
    'bg-gray-500',
    'rounded-xl',
    'flex',
    'relative',
    'shadow-lg'
  )

  const button = document.createElement('button')
  button.classList.add(
    'absolute',
    '-top-1',
    '-right-1',
    'w-4',
    'h-4',
    'rounded-full',
    'bg-red-600',
    'ring-2',
    'ring-red-700',
    'hover:ring-4',
    'transition',
    'text-white',
    'flex',
    'justify-center',
    'items-center'
  )

  button.addEventListener('click', () => {
    delCart(item.id)
  })

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('h-6', 'w-6')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('stroke', 'currentColor')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('stroke-linecap', 'round')
  path.setAttribute('stroke-linejoin', 'round')
  path.setAttribute('stroke-width', '4')
  path.setAttribute('d', 'M6 18L18 6M6 6l12 12')

  svg.appendChild(path)
  button.appendChild(svg)

  const div2 = document.createElement('div')
  div2.classList.add('w-12', 'bg-gray-700', 'rounded-l-xl')

  const img = document.createElement('img')
  img.classList.add('w-full', 'h-full', 'object-contain')
  img.src = '/asests/food/' + item.image

  div2.appendChild(img)

  const div3 = document.createElement('div')

  div3.classList.add(
    'text-white',
    'p-2',
    'font-semibold',
    'flex',
    'flex-grow',
    'justify-center',
    'items-center'
  )
  div3.innerHTML = item.name + ' x ' + quantity

  div.appendChild(button)
  div.appendChild(div2)
  div.appendChild(div3)

  return div
}

const updateCart = (cart, items) => {
  cartItems.innerHTML = ''
  let number = 0
  let total = 0

  if (cart.length == 0) {
    const div = document.createElement('div')
    div.classList.add('flex', 'justify-center', 'items-center')

    const empty = document.createElement('p')
    empty.classList.add('text-lg', 'font-bold', 'text-gray-600')
    empty.innerHTML = 'Cart is empty'

    div.appendChild(empty)

    cartItems.appendChild(div)
  }

  cart.forEach((item) => {
    const foodItem = items.find((i) => i.id == item.foodId)
    const div = document.createElement('div')
    div.classList.add('flex', 'justify-between', 'items-center', 'mb-2')

    number += item.quantity
    total += foodItem.price * item.quantity

    cartItems.appendChild(makeCartItem(foodItem, item.quantity))
  })

  number = number > 99 ? '99+' : number

  cartNumber.innerHTML = number
  cartNumber2.innerHTML = number

  checkout.removeAttribute('disabled')
  checkout.innerHTML = `Checkout ($${total.toFixed(2)})`
}

const main = async () => {
  let userData = await fetch('/api/me')
  let userCart = await fetch('/api/cart')
  let items = await fetch('/api/food-items')

  userData = await userData.json()
  cart = await userCart.json()
  items = await items.json()

  console.log(userData, userCart)

  foodItemsList = items

  updateCart(cart, foodItemsList)
  makeAccountDropdown(userData.logedIn)
}

const openUserMenu = async (state = null) => {
  accountMenuOpen = state == null ? !accountMenuOpen : state

  state == null && openCart(false)

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
}

const openMobileMenu = async (state = null) => {
  mobileMenuOpen = state == null ? !mobileMenuOpen : state

  state == null && openUserMenu(false)

  if (mobileMenuOpen) {
    mobileMenu.classList.add('right-0', 'top-0')
  } else {
    mobileMenu.classList.remove('right-0', 'top-0')
  }
}

const openCart = (state = null) => {
  cartOpen = state == null ? !cartOpen : state

  state == null && openUserMenu(false)

  if (cartOpen) {
    cartContent.classList.remove('translate-x-full')
  } else {
    cartContent.classList.add('translate-x-full')
  }
}

accountMenuButton.addEventListener('click', () => openUserMenu())

mobileMenuButton.addEventListener('click', () => {
  openMobileMenu()
  openCart(false)
})
mobileMenuCloseButton.addEventListener('click', () => {
  openMobileMenu()
  openCart(false)
})

cartButton.addEventListener('click', () => openCart())
cartButton2.addEventListener('click', () => openCart())

document.onscroll = () => {
  // console.log(window.pageYOffset)
  if (window.pageYOffset >= 200) {
    toTop.classList.remove('md:translate-y-20')
    toTop.classList.remove('translate-y-24')
    toTop.classList.add('translate-y-0')
  } else {
    toTop.classList.add('md:translate-y-20')
    toTop.classList.add('translate-y-24')
    toTop.classList.remove('translate-y-0')
  }
}

main()
