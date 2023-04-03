const PRODUCTID = window.location
  .toString()
  .split('/')
  [window.location.toString().split('/').length - 1].substring(0, 36)

let quantity = 1

const itemImage = document.querySelector('#item-img')
const itemTitle = document.querySelector('#item-name')
const itemPrice = document.querySelector('#item-price')
const itemDescription = document.querySelector('#item-description')
const itemAddToCart = document.querySelector('#item-add')
const headTitle = document.querySelector('title')

const itemAdd = document.querySelector('#item-add')

const quantityUp = document.querySelector('#quantity-up')
const quantityDown = document.querySelector('#quantity-down')
const quantityValue = document.querySelector('#quantity-value')

let spinner = `<svg  class="w-6 h-6 mr-2  animate-spin text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>`
let check = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-600">
<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`
let error = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-600">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>`

const addToCart = async (id, quantity, btn) => {
  btn.disabled = true
  btn.innerHTML = spinner + 'Adding'

  const addToCartReq = await fetch('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      foodId: id,
      quantity: Number(quantity),
    }),
  })

  if (addToCartReq.status != 200) {
    btn.innerHTML = error + 'Error'
  } else {
    btn.innerHTML = check + 'Added'
  }

  const cart = await fetch('/api/cart')
  const cartData = await cart.json()
  console.log(cartData)

  updateCart(cartData, foodItemsList)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  btn.innerHTML = 'Add to Cart'
  btn.disabled = false
}

const getItem = async () => {
  const res = await fetch(`/api/food-items/${PRODUCTID}`)
  const data = await res.json()

  itemImage.src = `/asests/food/${data.image}`
  itemTitle.textContent = data.name
  itemPrice.textContent = `$${data.price.toFixed(2)}`
  itemDescription.textContent = data.description

  headTitle.textContent = `BurgerFuel | ${data.name}`

  itemAdd.removeAttribute('disabled')
}

itemAdd.addEventListener('click', () => {
  addToCart(PRODUCTID, quantity, itemAdd)
})

quantityUp.addEventListener('click', () => {
  quantity++
  quantityValue.value = quantity
})

quantityDown.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--
    quantityValue.value = quantity
  }
})

quantityValue.addEventListener('change', () => {
  if (quantityValue.value < 1) {
    quantityValue.value = 1
  }
  quantity = quantityValue.value
})

getItem()

quantityValue.value = quantity
