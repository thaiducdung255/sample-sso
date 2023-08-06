export type Config = {
  server: {
    port: number
  }
  jwt: {

  }
  auth: {
    google: {
      clientId: string
      clientSecret: string
      callbackUrl: string
    }
  }
  passport: {
  },
  mongodb: {
    url: string
  }
}
