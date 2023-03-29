import express from 'express'
const router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { nanoid } from 'nanoid'

const valaidateUser = (req, res, next) => {
  let token = req.cookies.token
  req.IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  req.token = token
  req.user = null

  // console.log(typeof token)

  if (typeof token != 'undefined' && token.length == 16) {
    prisma.user
      .findUnique({
        where: {
          token: token,
        },
      })
      .then((user) => {
        if (user != null) {
          req.user = user

          if (user.ip != req.IP) {
            prisma.user
              .update({
                where: {
                  id: user.id,
                },
                data: {
                  ip: req.IP,
                },
              })
              .then((user) => {
                req.user = user
                return next()
              })
          } else return next()
        } else return next()
      })
  } else {
    token = nanoid(16)
    req.token = token
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
    return next()
  }
}

router.get('/', (req, res) => {
  res.json({ message: 'ok' })
})

router.get('/me', valaidateUser, (req, res) => {
  res.json(req.user)
})

router.post('/login', valaidateUser, (req, res) => {
  if (req.user) return res.status(200).json({ message: 'ok' })

  const body = req.body
  const email = body.email
  const password = body.password

  // console.log(body)

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

  const body = req.body
  const name = body.name
  const email = body.email
  const password = body.password
  const passwordConfirm = body['password-confirm']

  console.log(body)

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

export default router
export { valaidateUser }
