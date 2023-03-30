import express from 'express'
const router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import z from 'zod'

import valaidateUser from '../util/validateUser.js'

router.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

router.get('/me', valaidateUser, (req, res) => {
  if (req.user) {
    const user = { name: req.user.name, email: req.user.email, logedIn: true }

    return res.json(user)
  } else return res.json({ message: 'not logged in', logedIn: false })
})

router.post('/me/update', valaidateUser, (req, res) => {
  if (req.user) {
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
      if (currentPassword != req.user.password) {
        return res.status(401).json({ message: 'Incorrect Password' })
      }
      toUpdate.password = newPassword
    }

    if (email.length > 0 && email != req.user.email) {
      toUpdate.email = email
    }

    prisma.user
      .update({
        where: {
          id: req.user.id,
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

router.post('/login', valaidateUser, (req, res) => {
  if (req.user) return res.status(200).json({ message: 'ok' })

  console.log(req.body)

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

  prisma.user
    .findFirst({
      where: {
        email: email,
        password: password,
      },
    })
    .then((user) => {
      if (user) {
        prisma.user
          .update({
            where: {
              id: user.id,
            },
            data: {
              token: req.token,
            },
          })
          .then((user) => {
            console.log(req.token)
            return res.status(200).json({ message: 'ok' })
          })
          .catch(() => {
            return res.status(401).json({ message: 'login failed' })
          })
      } else {
        return res.status(401).json({ message: 'Incorrect Email or Password' })
      }
    })
    .catch(() => {
      return res.status(401).json({ message: 'login fail db' })
    })
})

router.post('/register', valaidateUser, async (req, res) => {
  if (req.user) return res.status(200).json({ message: 'ok' })

  console.log(req.body)

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

  const checkEmail = await prisma.user.findFirst({
    where: {
      email: email,
    },
  })

  if (checkEmail) {
    return res.status(401).json({ message: 'Email already exists' })
  }

  const createUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      token: req.token,
      ip: req.IP,
    },
  })

  if (createUser) {
    return res.status(200).json({ message: 'ok' })
  }

  return res.status(401).json({ message: 'Registration failed' })
})

router.get('/logout', valaidateUser, (req, res) => {
  if (req.user) {
    console.log(req.user)

    prisma.user
      .update({
        where: {
          id: req.user.id,
        },
        data: {
          token: null,
        },
      })
      .then((user) => {
        // return res.status(200).json({ message: 'ok' })
        return res.redirect('/')
      })
      .catch((err) => {
        console.log(err)
        return res.status(401).json({ message: 'logout failed' })
      })
    // } else return res.status(401).json({ message: 'not logged in' })
  } else return res.redirect('/')
})

router.get('/cart', valaidateUser, (req, res) => {
  if (req.user) {
    prisma.user
      .findUnique({
        where: {
          id: req.user.id,
        },
      })
      .then((user) => {
        const cart = user.cart
        return res.json(cart)
      })
  } else return res.json({ message: 'not logged in' })
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

export default router
