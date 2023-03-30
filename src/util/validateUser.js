import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { nanoid } from 'nanoid'

const valaidateUser = async (req, res, next) => {
  let token = req.cookies.token
  req.IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  req.token = token
  req.user = null

  if (typeof token == 'undefined' || token.length != 16) {
    token = nanoid(16)
    req.token = token

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
    return next()
  }

  const getUser = await prisma.user.findUnique({
    where: {
      token: token,
    },
  })
  if (getUser == null) {
    return next()
  }

  req.user = getUser

  if (getUser.ip == req.IP) {
    return next()
  }

  const updateUserIp = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ip: req.IP,
    },
  })

  req.user = updateUserIp
  return next()
}

export default valaidateUser
