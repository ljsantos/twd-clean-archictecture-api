import { Router } from 'express'
import { adaptRout } from '@/main/adapters'
import { makeRegisterUserAndSendEmailController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/register', adaptRout(makeRegisterUserAndSendEmailController()))
}
