const Alert_ = (message) => {
  const TIME = 5000

  const alertBox = document.querySelector('#alerts')
  const alert = document.createElement('div')
  alert.classList.add(
    'bg-red-100',
    'rounded-lg',
    'py-4',
    'px-6',
    'mb-4',
    'text-base',
    'text-red-700',
    'overflow-hidden',
    'relative'
  )
  alert.innerHTML = message
  const bar = document.createElement('div')

  bar.classList.add(
    'absolute',
    'bottom-0',
    'left-0',
    'bg-red-700',
    'rounded',
    'h-2'
  )
  bar.style.width = '100%'
  alert.appendChild(bar)

  alertBox.appendChild(alert)

  const added = new Date().getTime()

  const updateBar = () => {
    const now = new Date().getTime()
    const diff = now - added
    const percent = 100 - (diff / TIME) * 100
    bar.style.width = `${percent}%`
    if (diff < TIME) {
      requestAnimationFrame(updateBar)
    } else {
      alert.remove()
    }
  }

  updateBar()
}

class customAlert {
  constructor(elementId) {
    this.element = document.querySelector(elementId)
    this.alerts = []
  }

  success(message, duration = 5000) {
    return this.addAlert(
      message,
      'bg-green-100',
      'bg-green-600',
      'text-green-700',
      duration
    )
  }

  error(message, duration = 5000) {
    return this.addAlert(
      message,
      'bg-red-100',
      'bg-red-600',
      'text-red-700',
      duration
    )
  }

  addAlert(message, bgColor, barColor, textColor, duration) {
    const alert = document.createElement('div')
    alert.classList.add(
      bgColor,
      'rounded-lg',
      'py-4',
      'px-6',
      'mb-4',
      'text-base',
      textColor,
      'overflow-hidden',
      'relative',
      'trantsition-all',
      'duration-300'
    )
    alert.innerHTML = message

    const bar = document.createElement('div')

    bar.classList.add(
      'absolute',
      'bottom-0',
      'left-0',
      barColor,
      'rounded-r',
      'h-2'
    )
    bar.style.width = '100%'
    alert.appendChild(bar)

    this.element.appendChild(alert)

    const added = new Date().getTime()

    if (duration == -1) {
      return alert
    }

    const updateBar = () => {
      const now = new Date().getTime()
      const diff = now - added
      const percent = 100 - (diff / duration) * 100
      bar.style.width = `${percent}%`

      if (diff < duration) {
        requestAnimationFrame(updateBar)
      } else {
        this.removeAlert(alert)
      }
    }

    updateBar()
    return alert
  }

  removeAlert(alert) {
    alert.classList.add('opacity-0', 'scale-50', '-translate-y-8')
    setTimeout(() => {
      alert.remove()
    }, 300)
  }
}

export default customAlert
