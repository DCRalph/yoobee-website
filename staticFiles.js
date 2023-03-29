import express from 'express'
const router = express.Router()

import fs from 'fs'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

import { valaidateUser } from './api.js'

const src = (f) => {
  return __dirname + '/src/' + f
}

router.get('/', (req, res) => {
  res.sendFile(src('index.html'))
})

router.get('/login', valaidateUser, (req, res) => {
  if (req.user) {
    return res.redirect('/account')
  } else {
    return res.sendFile(src('login.html'))
  }
})

router.get('/register', valaidateUser, (req, res) => {
  if (req.user) {
    return res.redirect('/account')
  } else {
    return res.sendFile(src('register.html'))
  }
})

router.get('/account', valaidateUser, (req, res) => {
  if (req.user) {
    return res.sendFile(src('account.html'))
  } else {
    return res.redirect('/login')
  }
})

router.get('/order', (req, res) => {
  return res.sendFile(src('order.html'))
})

router.get('/tailwind.css', (req, res) => {
  res.sendFile(src('tailwind.css'))
})

router.get('/asests/:filename', (req, res) => {
  const filename = src('asests/' + req.params.filename)
  if (filename.includes('..')) {
    return res.sendStatus(418)
  }
  if (fs.existsSync(filename)) {
    return res.status(200).sendFile(filename)
  } else {
    return res
      .status(404)
      .json({ err: '404 File Not Found', file: req.params.filename })
  }
})

router.get('/scripts/:filename', (req, res) => {
  const filename = src('scripts/' + req.params.filename)
  if (filename.includes('..')) {
    return res.sendStatus(418)
  }
  if (fs.existsSync(filename)) {
    return res.status(200).sendFile(filename)
  } else {
    return res
      .status(404)
      .json({ err: '404 File Not Found', file: req.params.filename })
  }
})

export default router
