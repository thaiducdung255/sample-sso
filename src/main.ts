import 'dotenv/config'
import express, { Request, Response } from 'express'
import passport from 'passport'
import { Strategy, Profile } from 'passport-google-oauth20'
import { Provider } from '@prisma/client'
import session from 'express-session'
import jwt from 'jsonwebtoken'

import { config } from './config/index'
import { prisma } from './db/client'

const app = express()
const { server, auth } = config
const { port } = server

app.use(express.json())

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'secret',
}))

app.use(passport.initialize())
app.use(passport.session())

const cache = {}

const googleStrategy = new Strategy({
  clientID: auth.google.clientId,
  clientSecret: auth.google.clientSecret,
  callbackURL: auth.google.callbackUrl,
}, async (_, __, profile: Profile, done) => {
  const user = await prisma.user.findFirst({
    where: {
      pId: profile.id,
    },
  })

  if (!user) {
    prisma.user.create({
      data: {
        name: profile.displayName,
        provider: profile.provider.toUpperCase() as Provider,
        email: profile._json.email,
        pId: profile.id,
        avatar: profile._json.picture,
      },
    })
  }

  done(null, profile)
})

passport.serializeUser((user: any, done) => {
  done(null, user.googleId || user.id)
})

passport.deserializeUser((googleId, done) => {
  done(null, {})
})

passport.use(googleStrategy)

app.get(
  '/auth/google',
  passport.authenticate(
    'google',
    {
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent',
    },
  ),
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req: Request, res: Response) => {
    const profile = req.user as Profile
    const token = jwt.sign({ data: profile._json }, 'test')
    req.headers.token = token
    res.json({
      token,
    })
  },
)

app.listen(port, () => {
  process.stdout.write(`Server is listening on port ${port}\n`)
})
