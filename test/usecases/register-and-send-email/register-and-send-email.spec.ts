import { User, UserData } from '@/entities'
import { Either, right } from '@/shared'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { MailServiceError } from '@/usecases/errors'
import { UserRepository } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-mail'
import { EmailService, EmailOptions } from '@/usecases/send-mail/ports'

class MailServiceMock implements EmailService {
  public timeSendEmailWasCalled = 0
  async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    this.timeSendEmailWasCalled++
    return right(mailOptions)
  }
}

describe('Register and send e-mail to user', () => {
  const attachmentFilePath = '../resources/text.txt'
  const fromName = 'Test'
  const fromEmail = 'from_email@mail.com'
  const toName = 'any_name'
  const toEmail = 'any_email@mail.com'
  const subject = 'Test e-mail'
  const emailBody = 'Hello world attachament test'
  const emailBodyHtml = '<b>Hellow world attachment test</b>'
  const attachment = [{
    filename: attachmentFilePath,
    contentType: 'text/plain'
  }]

  const mailOptions: EmailOptions = {
    host: 'test',
    port: 867,
    username: 'test',
    password: 'passwd',
    from: fromName + ' ' + fromEmail,
    to: toName + ' <' + toEmail + '>',
    subject: subject,
    text: emailBody,
    html: emailBodyHtml,
    attachments: attachment
  }

  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailServiceMock, mailOptions)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const name = 'any_name'
    const email = 'any@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as User
    const user = await repo.findUserByEmail('any@email.com')
    expect(user.name).toBe('any_name')
    expect(response.name.value).toBe('any_name')
    expect(mailServiceMock.timeSendEmailWasCalled).toEqual(1)
  })

  test('should not add user with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailServiceMock, mailOptions)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const name = 'any_name'
    const invalidEmail = 'anyemail.com'
    const error = (await registerAndSendEmailUseCase.perform({ name: name, email: invalidEmail })).value as Error
    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual('Invalid e-mail: ' + invalidEmail + '.')
  })

  test('should not add user with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailServiceMock, mailOptions)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const invalidName = 'a'
    const email = 'any@email.com'
    const error = (await registerAndSendEmailUseCase.perform({ name: invalidName, email: email })).value as Error
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual('Invalid name: ' + invalidName + '.')
  })
})
