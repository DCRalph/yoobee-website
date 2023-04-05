import express from 'express'
const router = express.Router()

import fs from 'fs'

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

import valaidateSession from '../util/validateSession.js'
import parse from '../util/component.js'

const publicDir = (f) => {
  return resolve(__dirname, '../public/' + f)
}

const readFile = (f) => {
  let fileData = fs.readFileSync(f, 'utf8')

  return parse(fileData)
}

router.get('/robots.txt', (req, res) => {
  res.sendFile(publicDir('robots.txt'))
})

router.get('/', (req, res) => {
  // res.sendFile(publicDir('index.html'))

  res.send(readFile(publicDir('index.html')))
})

router.get('/our-story', (req, res) => {
  // res.sendFile(publicDir('our-story.html'))

  res.send(readFile(publicDir('our-story.html')))
})

router.get('/login', valaidateSession, (req, res) => {
  console.log(req.session)
  if (req.session.account) {
    return res.redirect('/account')
  } else {
    return res.sendFile(publicDir('login.html'))
  }
})

router.get('/register', valaidateSession, (req, res) => {
  if (req.session.account) {
    return res.redirect('/account')
  } else {
    return res.sendFile(publicDir('register.html'))
  }
})

router.get('/account', valaidateSession, (req, res) => {
  if (req.session.account) {
    // return res.sendFile(publicDir('account.html'))

    res.send(readFile(publicDir('account.html')))
  } else {
    return res.redirect('/login')
  }
})

router.get('/order', (req, res) => {
  // return res.sendFile(publicDir('order.html'))

  res.send(readFile(publicDir('order.html')))
})

router.get('/checkout', (req, res) => {
  res.send(readFile(publicDir('checkout.html')))

  // return res.sendFile(publicDir('checkout.html'))
})

router.get('/product/:id(*)', (req, res) => {
  // return res.sendFile(publicDir('productInfo.html'))

  res.send(readFile(publicDir('productInfo.html')))
})

router.get('/tailwind.css', (req, res) => {
  res.sendFile(publicDir('tailwind.css'))
})

router.get('/asests/:filename(*)', (req, res) => {
  const filename = publicDir('asests/' + req.params.filename)
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

router.get('/scripts/:filename(*)', (req, res) => {
  const filename = publicDir('scripts/' + req.params.filename)
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
