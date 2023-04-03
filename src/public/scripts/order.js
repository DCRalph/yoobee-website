const filterBtns = document.querySelectorAll('input[name="category"]')
const foodItemsContainer = document.querySelector('#food-items-container')

let foodItems = []

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

const getFilter = () => {
  const filter = [...document.querySelectorAll('input[name="category"]')]
  const btn = filter.find((input) => input.checked)
  const category = btn.getAttribute('category')
  console.log(category)
  return category
}

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
  btn.innerHTML = 'Add to cart'
  btn.disabled = false
}

const openInfoPage = async (id) => {
  window.location = '/product/' + id
}

const renderFoodItems2 = (items, filter) => {
  foodItemsContainer.innerHTML = ''
  items.forEach((item) => {
    if (filter !== 'all' && !item.category.includes(filter)) return

    const foodItem = document.createElement('div')
    foodItem.setAttribute('x-type', 'foodItem')
    foodItem.setAttribute('x-id', item.id)
    // foodItem.setAttribute('href', `/order/product/${item.id}`)
    foodItem.classList.add(
      'group',
      'col-span-12',
      'sm:col-span-6',
      'md:col-span-4',
      'lg:col-span-3',
      // 'xl:col-span-2',
      'overflow-hidden',
      'rounded-lg',
      'bg-zinc-300',
      'h-min'
    )

    const foodImage = document.createElement('div')
    foodImage.setAttribute('x-type', 'foodImage')
    foodImage.classList.add(
      'w-full',
      'overflow-hidden',
      'bg-zinc-400',
      'p-2',
      'h-48'
    )

    const foodImageImg = document.createElement('img')
    foodImageImg.setAttribute('x-type', 'foodImageImg')
    foodImageImg.src = `/asests/food/${item.image}`

    foodImageImg.classList.add(
      'h-full',
      'w-full',
      'object-contain',
      'object-center',
      'group-hover:opacity-75'
    )

    foodImage.appendChild(foodImageImg)

    const foodInfo = document.createElement('div')
    foodInfo.setAttribute('x-type', 'foodInfo')
    foodInfo.classList.add('flex', 'flex-col', 'gap-1', 'p-2')

    const foodName = document.createElement('h3')
    foodName.setAttribute('x-type', 'foodName')
    foodName.classList.add('text-base', 'text-zinc-700')
    foodName.innerHTML = item.name

    const foodPrice = document.createElement('p')
    foodPrice.setAttribute('x-type', 'foodPrice')
    foodPrice.classList.add('text-lg', 'font-medium', 'text-zinc-900')
    foodPrice.innerHTML = `$${item.price.toFixed(2)}`

    const foodBtns = document.createElement('div')
    foodBtns.setAttribute('x-type', 'foodBtns')
    foodBtns.classList.add('flex', 'gap-2', 'w-full', 'mt-2')

    const foodInfoBtn = document.createElement('button')
    foodInfoBtn.setAttribute('x-type', 'foodInfoBtn')
    foodInfoBtn.classList.add('btn-blue', '!p-1')

    foodInfoBtn.addEventListener('click', () => {
      console.log('clicked', item.id, item.name)
      openInfoPage(item.id)
    })

    const foodInfoBtnSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )

    foodInfoBtnSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    foodInfoBtnSvg.setAttribute('fill', 'none')
    foodInfoBtnSvg.setAttribute('viewBox', '0 0 24 24')
    foodInfoBtnSvg.setAttribute('stroke-width', '1.5')
    foodInfoBtnSvg.setAttribute('stroke', 'currentColor')
    foodInfoBtnSvg.classList.add('w-8', 'h-8')

    const foodInfoBtnPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )

    foodInfoBtnPath.setAttribute('stroke-linecap', 'round')
    foodInfoBtnPath.setAttribute('stroke-linejoin', 'round')
    foodInfoBtnPath.setAttribute(
      'd',

      'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    )

    foodInfoBtnSvg.appendChild(foodInfoBtnPath)
    foodInfoBtn.appendChild(foodInfoBtnSvg)

    foodBtns.appendChild(foodInfoBtn)

    const addToCartBtn = document.createElement('button')
    addToCartBtn.setAttribute('x-type', 'addToCartBtn')
    addToCartBtn.classList.add('btn-primary', 'w-full')
    addToCartBtn.innerHTML = 'Add to Cart'

    addToCartBtn.addEventListener('click', () => {
      console.log('clicked add', item.id, item.name)
      addToCart(item.id, 1, addToCartBtn)
    })

    foodBtns.appendChild(addToCartBtn)

    foodInfo.appendChild(foodName)
    foodInfo.appendChild(foodPrice)
    foodInfo.appendChild(foodBtns)

    foodItem.appendChild(foodImage)
    foodItem.appendChild(foodInfo)

    foodItemsContainer.appendChild(foodItem)
  })
}

const getFoodItems = async () => {
  const filter = getFilter()
  const response = await fetch(`/api/food-items`)
  const data = await response.json()
  foodItemsList = data

  renderFoodItems2(data, filter)
}

filterBtns[0].checked = true
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = getFilter()
    renderFoodItems2(foodItemsList, filter)
  })
})

getFoodItems()
