import { Router } from 'express'
import { adaptRout } from '@/main/config/adapters'
import { makeRegisterUserController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/register', adaptRout(makeRegisterUserController()))
}
