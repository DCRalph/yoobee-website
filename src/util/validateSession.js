import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { nanoid } from 'nanoid'

const valaidateSesion = async (req, res, next) => {
  req.IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  req.token = req.cookies.token
  req.session = null
  req.account = null

  if (typeof req.token == 'undefined' || req.token.length != 16) {
    // console.log(req.url, 'no token')
    req.token = nanoid(16)

    res.cookie('token', req.token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
  }

  const getSession = await prisma.session.findUnique({
    where: {
      token: req.token,
    },
    include: {
      account: true,
    },
  })

  req.session = getSession

  if (getSession == null) {
    // console.log(req.url, 'no session')

    const createSession = await prisma.session.create({
      data: {
        token: req.token,
        ip: req.IP,
        cart: [],
      },
    })

    req.session = createSession
    return next()
  }

  if (req.session.ip != req.IP) {
    const updateSessionIp = await prisma.session.update({
      where: {
        id: req.session.id,
      },
      include: {
        account: true,
      },
      data: {
        ip: req.IP,
      },
    })

    req.session = updateSessionIp
  }

  return next()
}

export default valaidateSesion
