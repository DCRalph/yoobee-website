import express from 'express'
const router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import z from 'zod'

import valaidateSession from '../util/validateSession.js'

router.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

router.get('/me', valaidateSession, (req, res) => {
  let sendBack = { user: null, account: null, logedIn: false }

  if (req.session) {
    sendBack.user = {
      id: req.session.id,
      token: req.session.token,
    }
  }

  if (req.session.account) {
    sendBack.account = {
      id: req.session.account.id,
      email: req.session.account.email,
      name: req.session.account.name,
    }
    sendBack.logedIn = true
  }

  return res.json(sendBack)
  // } else return res.json({ message: 'not logged in', logedIn: false })
})

router.post('/me/update', valaidateSession, (req, res) => {
  if (req.session) {
    let body
    const v = z.object({
      email: z.string().email(),
      currentPassword: z.string(),
      newPassword: z.string(),
    })

    try {
      body = v.parse(req.body)
    } catch (err) {
      console.log(err)

      return res.status(401).json({ message: 'Input error' })
    }

    const email = body.email
    const currentPassword = body.currentPassword
    const newPassword = body.newPassword

    const toUpdate = {}

    if (newPassword.length > 0) {
      if (currentPassword != req.session.password) {
        return res.status(401).json({ message: 'Incorrect Password' })
      }
      toUpdate.password = newPassword
    }

    if (email.length > 0 && email != req.session.email) {
      toUpdate.email = email
    }

    prisma.account
      .update({
        where: {
          id: req.session.accountId,
        },
        data: toUpdate,
      })
      .then((user) => {
        return res.status(200).json({ message: 'ok' })
      })
      .catch(() => {
        return res.status(401).json({ message: 'update failed' })
      })
  } else return res.status(401).json({ message: 'not logged in' })
})

router.post('/login', valaidateSession, async (req, res) => {
  if (!req.session) return res.status(401).json({ message: 'no session' })
  if (req.session.account) return res.status(200).json({ message: 'ok' })

  // console.log(req.body)

  let body
  const v = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  try {
    body = v.parse(req.body)
  } catch (err) {
    console.log(err)

    return res.status(401).json({ message: 'Input error' })
  }

  const email = body.email
  const password = body.password

  const authenticateAccount = await prisma.account.findFirst({
    where: {
      email: email,
      password: password,
    },
  })

  if (!authenticateAccount)
    return res
      .status(401)
      .json({ message: 'Incorrect Email or Password', code: 1 })

  const updateSession = await prisma.session.update({
    where: {
      id: req.session.id,
    },
    data: {
      cart: [],
      account: {
        connect: {
          id: authenticateAccount.id,
        },
      },
    },
  })

  if (!updateSession)
    return res.status(401).json({ message: 'login failed', code: 2 })

  if (updateSession.cart.length > 0) {
    const updateAccount = await prisma.account.update({
      where: {
        id: authenticateAccount.id,
      },
      data: {
        cart: req.session.cart,
      },
    })

    if (!updateAccount)
      return res.status(401).json({ message: 'login failed', code: 3 })
  }

  return res.status(200).json({ message: 'ok' })
})

router.post('/register', valaidateSession, async (req, res) => {
  if (!req.session) return res.status(401).json({ message: 'no session' })
  if (req.session.account) return res.status(200).json({ message: 'ok' })

  // console.log(req.body)

  let body
  const v = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    passwordConfirm: z.string(),
  })

  try {
    body = v.parse(req.body)
  } catch (err) {
    console.log(err)

    return res.status(401).json({ message: 'Input error' })
  }

  const name = body.name
  const email = body.email
  const password = body.password
  const passwordConfirm = body.passwordConfirm

  if (password != passwordConfirm) {
    return res.status(401).json({ message: 'Passwords do not match' })
  }

  const checkEmail = await prisma.account.findFirst({
    where: {
      email: email,
    },
  })

  if (checkEmail) {
    return res.status(401).json({ message: 'Email already exists' })
  }

  const createUser = await prisma.account.create({
    data: {
      name: name,
      email: email,
      password: password,
      cart: req.session.cart,
      session: {
        connect: {
          id: req.session.id,
        },
      },
    },
  })

  if (!createUser)
    return res.status(401).json({ message: 'Registration failed', code: 1 })

  const updateSession = await prisma.session.update({
    where: {
      id: req.session.id,
    },
    data: {
      cart: [],
    },
  })

  if (!updateSession)
    return res.status(401).json({ message: 'Registration failed', code: 2 })

  return res.status(200).json({ message: 'ok' })
})

router.get('/logout', valaidateSession, (req, res) => {
  if (!req.session.account) {
    return res.redirect('/')
  }

  prisma.session
    .update({
      where: {
        id: req.session.id,
      },
      data: {
        account: {
          disconnect: true,
        },
      },
    })
    .then(() => {
      // return res.status(200).json({ message: 'ok' })
      return res.redirect('/')
    })
    .catch((err) => {
      console.log(err)
      return res.status(401).json({ message: 'logout failed' })
    })
})

router.get('/food-items', (req, res) => {
  prisma.food.findMany().then((food) => {
    return res.json(food)
  })
})

router.get('/food-items/:id', (req, res) => {
  const id = req.params.id

  prisma.food
    .findUnique({
      where: {
        id,
      },
    })
    .then((food) => {
      return res.json(food)
    })
})

router.get('/cart', valaidateSession, async (req, res) => {
  if (req.session.account) return res.status(200).json(req.session.account.cart)
  else if (req.session) return res.status(200).json(req.session.cart)

  return res.status(401).json({ message: 'no account or session' })
})

router.post('/cart/add', valaidateSession, async (req, res) => {
  if (!req.session) return res.status(401).json({ message: 'no session' })

  let body

  const v = z.object({
    foodId: z.string(),
    quantity: z.number(),
  })

  try {
    body = v.parse(req.body)
  } catch (err) {
    console.log(err)

    return res.status(401).json({ message: 'Input error' })
  }

  const foodId = body.foodId
  const quantity = body.quantity

  const cart =
    req.session.account == null ? req.session.cart : req.session.account.cart

  let updated = false

  cart.forEach((item) => {
    if (item.foodId == foodId) {
      item.quantity += quantity
      updated = true
      return
    }
  })

  if (!updated) {
    cart.push({
      foodId: foodId,
      quantity: quantity,
    })
  }

  let update

  if (req.session.account) {
    update = await prisma.account.update({
      where: {
        id: req.session.account.id,
      },
      data: {
        cart: cart,
      },
    })
  } else {
    update = await prisma.session.update({
      where: {
        id: req.session.id,
      },
      data: {
        cart: cart,
      },
    })
  }

  if (!update) return res.status(401).json({ message: 'add to cart failed' })

  return res.status(200).json({ message: 'ok' })
})

router.post('/cart/remove', valaidateSession, async (req, res) => {
  if (!req.session) return res.status(401).json({ message: 'no session' })

  let body

  const v = z.object({
    foodId: z.string(),
  })

  try {
    body = v.parse(req.body)
  } catch (err) {
    console.log(err)

    return res.status(401).json({ message: 'Input error' })
  }

  const foodId = body.foodId

  let cart =
    req.session.account == null ? req.session.cart : req.session.account.cart

  let updated = false

  cart = cart.filter((item) => {
    if (item.foodId == foodId) {
      updated = true
      return false
    }
    return true
  })

  if (!updated) {
    return res.status(401).json({ message: 'item not in cart' })
  }

  let update

  if (req.session.account) {
    update = await prisma.account.update({
      where: {
        id: req.session.account.id,
      },
      data: {
        cart: cart,
      },
    })
  } else {
    update = await prisma.session.update({
      where: {
        id: req.session.id,
      },
      data: {
        cart: cart,
      },
    })
  }

  if (!update)
    return res.status(401).json({ message: 'remove from cart failed' })

  return res.status(200).json({ message: 'ok' })
})

export default router
