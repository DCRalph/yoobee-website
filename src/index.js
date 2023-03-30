import dotenv from 'dotenv'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

import express from 'express'

import api from './routes/api.js'
import staticFiles from './routes/staticFiles.js'

import cookieParser from 'cookie-parser'

// import { PrismaClient } from '@prisma/client'

dotenv.config()
// const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json())
app.use('/api', api)
app.use('/', staticFiles)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
