import dotenv from 'dotenv'
dotenv.config()

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

import express from 'express'
import api from './api.js'
import staticFiles from './staticFiles.js'

import cookieParser from 'cookie-parser'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { nanoid } from 'nanoid'

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

app.use(cookieParser())
app.use(express.json())
app.use('/api', api)
app.use('/', staticFiles)

// app.use(valaidateUser)

// app.use(express.static('src'))

const PORT = process.env.PORT || 3000

// app.get('/', (req, res) => {
//   res.sendFile(src('index.html'))
// })

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
