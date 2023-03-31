import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { nanoid } from 'nanoid'

const valaidateSesion = async (req, res, next) => {
  let token = req.cookies.token
  req.IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  req.token = token
  req.session = null
  req.account = null

  if (typeof token == 'undefined' || token.length != 16) {
    token = nanoid(16)
    req.token = token

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
  }

  const getSession = await prisma.session.findUnique({
    where: {
      token: token,
    },
    include: {
      account: true,
    },
  })

  if (getSession == null) {
    const createSession = await prisma.session.create({
      data: {
        token: token,
        ip: req.IP,
      },
    })

    req.session = createSession
    return next()
  }

  req.session = getSession

  if (getSession.ip != req.IP) {
    const updateSessionIp = await prisma.session.update({
      where: {
        id: getSession.id,
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
