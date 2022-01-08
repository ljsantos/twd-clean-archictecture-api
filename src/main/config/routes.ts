import { Express, Router } from 'express'
import { readdirSync } from 'fs'
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // eslint-disable-next-line node/no-path-concat
  readdirSync(`${__dirname}/../routes`).map(async file => {
    // eslint-disable-next-line node/no-path-concat
    (await import(`${__dirname}/../routes/${file}`)).default(router)
  })
}
