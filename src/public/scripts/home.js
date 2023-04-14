const imgs = document.querySelectorAll('#imgs #img')

const imgNextBtn = document.querySelector('#imgNextBtn')
const imgPrevBtn = document.querySelector('#imgPrevBtn')

const imgNum = document.querySelector('#imgNum')

const featuredItemsDiv = document.querySelector('#featuredItems')

let currentTimer = 0
class Timer {
  #timer
  constructor(fnIn, t, state = true) {
    this.id = currentTimer++
    this.fn = () => {
      fnIn()
    }
    this.t = t
    this.state = state
    if (this.state) this.#timer = setInterval(this.fn, this.t)
  }

  stop = () => {
    if (this.state) {
      this.state = false
      clearInterval(this.#timer)
    }
  }

  start = () => {
    if (!this.state) {
      this.state = true
      this.#timer = setInterval(this.fn, this.t)
    }
  }

  reset = (nt = null) => {
    if (nt != null) this.t = nt
    this.stop(false)
    this.start(false)
  }
}

class imgSlider {
  constructor(imgs) {
    this.imgs = imgs
    this.currIndex = 0
    this.lastIndex = 0

    this.timer = new Timer(() => {
      this.next()
    }, 5000)
  }

  getNextIndex() {
    if (this.currIndex === this.imgs.length - 1) {
      return 0
    }
    return this.currIndex + 1
  }

  getPrevIndex() {
    if (this.currIndex === 0) {
      return this.imgs.length - 1
    }
    return this.currIndex - 1
  }

  next() {
    this.currIndex = this.getNextIndex()
    this.updateImgs()
  }

  prev() {
    this.currIndex = this.getPrevIndex()
    this.updateImgs()
  }

  updateImgs() {
    let currIndex = this.currIndex
    let nextIndex = this.getNextIndex()
    let prevIndex = this.getPrevIndex()

    this.imgs.forEach((img, i) => {
      img.classList.add('hidden')
      img.classList.remove(
        'translate-x-full',
        '-translate-x-full',
        'translate-x-0',
        'z-10',
        'z-20',
        'z-30'
      )

      if (i == currIndex) {
        img.classList.remove('hidden')
        img.classList.add('translate-x-0', 'z-20')
      }

      if (i == nextIndex) {
        img.classList.remove('hidden')
        img.classList.add('translate-x-full', 'z-10')
      }

      if (i == prevIndex) {
        img.classList.remove('hidden')
        img.classList.add('-translate-x-full', 'z-10')
      }
    })

    imgNum.innerText = currIndex + 1 + '/' + this.imgs.length

    this.lastIndex = currIndex
  }
}

const makeFeaturedItem = (item) => {
  const div = document.createElement('div')
  div.classList.add(
    'h-min',
    'overflow-hidden',
    'rounded-xl',
    'bg-zinc-500',
    'group'
  )

  const imgLink = document.createElement('a')
  imgLink.href = '/product/' + item.id

  const img = document.createElement('img')
  img.src = `/asests/food/${item.image}`
  img.classList.add(
    'm-auto',
    'object-contain',
    'p-4',
    'h-48',
    'group-hover:opacity-75',
    'transition-opacity'
  )

  const div2 = document.createElement('div')
  div2.classList.add('bg-zinc-800', 'p-4', 'text-white')

  const h2 = document.createElement('h2')
  h2.classList.add('mb-2', 'text-center', 'text-2xl', 'font-semibold')
  h2.innerText = item.name

  const p = document.createElement('p')
  p.classList.add('pb-2')
  p.innerText = item.description

  const btn = document.createElement('button')
  btn.classList.add('btn-blue', 'mx-auto')
  btn.innerText = 'More Info'

  btn.addEventListener('click', () => {
    window.location.href = '/product/' + item.id
  })

  div2.appendChild(h2)
  div2.appendChild(p)
  div2.appendChild(btn)

  imgLink.appendChild(img)

  div.appendChild(imgLink)
  div.appendChild(div2)

  return div
}

const getFeaturedItems = async () => {
  const response = await fetch(`/api/food-items`)
  const data = await response.json()

  data.forEach((item) => {
    if (item.category.includes('featured')) {
      featuredItemsDiv.appendChild(makeFeaturedItem(item))
    }
  })
}

const slider = new imgSlider(imgs)
slider.updateImgs()

getFeaturedItems()

imgNextBtn.addEventListener('click', () => {
  slider.next()
  slider.timer.reset()
})

imgPrevBtn.addEventListener('click', () => {
  slider.prev()
  slider.timer.reset()
})
