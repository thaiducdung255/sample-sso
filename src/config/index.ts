import 'dotenv/config'
import { Config } from '../../types/config'

export const config: Config = {
  server: {
    port: Number(process.env.PORT || 3000),
  },
  jwt: {},
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
    },
  },
  passport: {},
  mongodb: {
    url: process.env.DATABASE_URL || '',
  },
}
