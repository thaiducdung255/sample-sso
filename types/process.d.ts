declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALLBACK_URL: string
    DATABASE_URL: string
  }
}
