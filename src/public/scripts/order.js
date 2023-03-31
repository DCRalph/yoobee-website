const filterBtns = document.querySelectorAll('input[name="category"]')
const foodItemsContainer = document.querySelector('#food-items-container')

let foodItems = []

const getFilter = () => {
  const filter = [...document.querySelectorAll('input[name="category"]')]
  const btn = filter.find((input) => input.checked)
  const category = btn.getAttribute('category')
  console.log(category)
  return category
}

const renderFoodItems = (foodItems, filter) => {
  const foodItemsContainer = document.querySelector('#food-items-container')
  foodItemsContainer.innerHTML = ''

  foodItems.forEach((item) => {
    console.log(item.category, filter)
    if (filter !== 'all' && !item.category.includes(filter)) return

    const foodItem = document.createElement('div')
    foodItem.setAttribute('x-type', 'food-item')
    foodItem.setAttribute('x-id', item.id)

    foodItem.classList.add(
      'col-span-full',
      'grid',
      'h-64',
      'w-full',
      'grid-cols-3',
      'gap-2',
      'rounded-xl',
      'bg-gray-200',
      'p-2',
      'lg:col-span-6'
    )

    const foodImage = document.createElement('img')
    foodImage.setAttribute('x-type', 'food-image')

    foodImage.src = `/asests/food/${item.image}`
    foodImage.classList.add('col-span-1', 'h-full', 'w-full', 'object-contain')

    const foodInfo = document.createElement('div')
    foodInfo.setAttribute('x-type', 'food-info')
    foodInfo.classList.add('col-span-2')

    const foodInfoBar = document.createElement('div')
    foodInfoBar.setAttribute('x-type', 'food-info-bar')
    foodInfoBar.classList.add('flex', 'h-16', 'w-full', 'gap-2')

    const foodName = document.createElement('div')
    foodName.setAttribute('x-type', 'food-name')
    foodName.classList.add(
      'flex',
      'w-full',
      'items-center',
      'justify-between',
      'rounded-lg',
      'bg-gray-300',
      'py-2',
      'px-4'
    )

    const foodNameText = document.createElement('h2')
    foodNameText.setAttribute('x-type', 'food-name-text')
    foodNameText.classList.add('text-4xl', 'font-semibold')
    foodNameText.innerHTML = item.name

    const foodPrice = document.createElement('h2')
    foodPrice.setAttribute('x-type', 'food-price')
    foodPrice.classList.add('font-base', 'text-lg', 'text-gray-700')
    foodPrice.innerHTML = `$${item.price}`

    foodName.appendChild(foodNameText)
    foodName.appendChild(foodPrice)

    const addToCartBtn = document.createElement('button')
    addToCartBtn.setAttribute('x-type', 'add-to-cart-btn')
    addToCartBtn.classList.add(
      'flex',
      'rounded-lg',
      'p-2',
      'aspect-square',
      'h-full',
      'text-sm',
      'text-black',
      'bg-yellow-400',
      'hover:bg-yellow-500',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-yellow-400',
      'focus:ring-opacity-50'
    )

    const addToCartBtnSvg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )

    addToCartBtnSvg.setAttribute('fill', 'none')
    addToCartBtnSvg.setAttribute('viewBox', '0 0 24 24')
    addToCartBtnSvg.setAttribute('stroke-width', '1.5')
    addToCartBtnSvg.setAttribute('stroke', 'currentColor')
    addToCartBtnSvg.classList.add('w-full', 'h-full')

    const addToCartBtnSvgPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    addToCartBtnSvgPath.setAttribute('stroke-linecap', 'round')
    addToCartBtnSvgPath.setAttribute('stroke-linejoin', 'round')

    addToCartBtnSvgPath.setAttribute(
      'd',
      'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
    )

    addToCartBtnSvg.appendChild(addToCartBtnSvgPath)
    addToCartBtn.appendChild(addToCartBtnSvg)

    addToCartBtn.addEventListener('click', () => {
      console.log('clicked', item.id, item.name)
    })

    // addToCartBtn.addEventListener('click', () => {
    //   const cartItem = {
    //     id: item.id,
    //     name: item.name,
    //     price: item.price,
    //     quantity: 1,
    //   }
    //   const cart = JSON.parse(localStorage.getItem('cart')) || []
    //   const existingItem = cart.find((item) => item.id === cartItem.id)
    //   if (existingItem) {
    //     existingItem.quantity += 1
    //   } else {
    //     cart.push(cartItem)
    //   }
    //   localStorage.setItem('cart', JSON.stringify(cart))
    // })

    const foodDescription = document.createElement('div')
    foodDescription.setAttribute('x-type', 'food-description')
    foodDescription.classList.add('mt-4')

    const foodDescriptionTitle = document.createElement('p')
    foodDescriptionTitle.setAttribute('x-type', 'food-description-title')
    foodDescriptionTitle.classList.add('text-lg', 'font-semibold')
    foodDescriptionTitle.innerHTML = 'Description'

    const foodDescriptionText = document.createElement('p')
    foodDescriptionText.setAttribute('x-type', 'food-description-text')
    foodDescriptionText.classList.add('text-lg', 'text-gray-700')
    foodDescriptionText.innerHTML = item.description

    foodDescription.appendChild(foodDescriptionTitle)
    foodDescription.appendChild(foodDescriptionText)

    foodInfoBar.appendChild(foodName)
    foodInfoBar.appendChild(addToCartBtn)

    foodInfo.appendChild(foodInfoBar)
    foodInfo.appendChild(foodDescription)

    foodItem.appendChild(foodImage)
    foodItem.appendChild(foodInfo)

    foodItemsContainer.appendChild(foodItem)
  })
}

const getFoodItems = async () => {
  const filter = getFilter()
  const response = await fetch(`/api/food-items`)
  const data = await response.json()
  foodItems = data

  renderFoodItems(data, filter)
}

filterBtns[0].checked = true
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = getFilter()
    renderFoodItems(foodItems, filter)
  })
})

getFoodItems()
