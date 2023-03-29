import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cookieParser from 'cookie-parser'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app = express()

const valaidateUser = (req, res, next) => {
  let token = req.cookies.token

  if (token != 'undefined') {
    prisma.user
      .findUnique({
        where: {
          token: token,
        },
      })
      .then((user) => {
        if (user) {
          req.user = user
        } else {
          let newUser = {
            token: token || nanoid(16),
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          }
        }
        next()
      })
  }
}

// if (users[tok]) {
//   req.user = users[tok]
//   next()
// } else {
//   let newUser = {
//     id: tok || nanoid(16),
//     userId: null,
//     ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
//   }
//   users[newUser.id] = newUser
//   req.user = users[newUser.id]
//   res.cookie('token', newUser.id, {
//     maxAge: 1000 * 60 * 60 * 24 * 365,
//     sameSite: true,
//   })
//     next()

// }

app.use(cookieParser())
app.use(express.json())
// app.use(valaidateUser)

app.use(express.static('src'))

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.get('/api/me', valaidateUser, (req, res) => {
  res.json(req.user)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
