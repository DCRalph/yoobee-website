const PRODUCTID = window.location.toString().split('/')[
  window.location.toString().split('/').length - 1
]

const itemImage = document.querySelector('#item-img')
const itemTitle = document.querySelector('#item-name')
const itemPrice = document.querySelector('#item-price')
const itemDescription = document.querySelector('#item-description')
const itemAddToCart = document.querySelector('#item-add')
const headTitle = document.querySelector('title')

const itemAdd = document.querySelector('#item-add')

const addToCart = async (id, quantity, btn) => {
  const saveBtn = btn

  btn.disabled = true

  let btnDots = 0

  let btnDotsInterval = setInterval(() => {
    if (btnDots <= 3) {
      saveBtn.innerHTML = 'Adding' + '.'.repeat(btnDots)
      btnDots++
    } else {
      btnDots = 0
    }
  }, 200)

  const addToCartReq = await fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      foodId: id,
      quantity: quantity,
    }),
  })

  clearInterval(btnDotsInterval)

  if (addToCartReq.status != 200) {
    saveBtn.innerHTML = 'Error'
  } else {
    saveBtn.innerHTML = 'Added'
  }

  const cart = await fetch('/api/cart')
  const cartData = await cart.json()
  console.log(cartData)

  const cartCount = document.querySelector('#cart-number')
  cartCount.innerHTML = cartData.reduce((acc, item) => acc + item.quantity, 0)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  saveBtn.innerHTML = 'Add to Cart'
  btn.disabled = false
}

itemAdd.addEventListener('click', () => {
  addToCart(PRODUCTID, 1, itemAdd)
})

const getItem = async () => {
  const res = await fetch(`/api/food-items/${PRODUCTID}`)
  const data = await res.json()

  itemImage.src = `/asests/food/${data.image}`
  itemTitle.textContent = data.name
  itemPrice.textContent = `$${data.price}`
  itemDescription.textContent = data.description

  headTitle.textContent = `BurgerFuel | ${data.name}`

  itemAdd.removeAttribute('disabled')
}

getItem()
