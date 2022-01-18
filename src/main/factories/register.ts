import { RegisterUserController } from '@/web-controllers'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { SendEmail } from '@/usecases/send-mail'
import { NodemailerMailService } from '@/external/mail-services'
import { getEmailOptions } from '../config/email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

export const makeRegisterUserAndSendEmailController = (): RegisterUserController => {
  const mongoDbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)
  const emailService = new NodemailerMailService()
  const sendEmailUseCase = new SendEmail(emailService, getEmailOptions())
  const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUserOnMailingListUseCase, sendEmailUseCase)
  const registerAndSendEmailController = new RegisterUserController(registerAndSendEmailUseCase)
  return registerAndSendEmailController
}
