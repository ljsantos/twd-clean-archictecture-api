import { User, UserData } from '@/entities'
import { Either, left, Left, Right, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { SendEmail } from '@/usecases/send-mail'
import { EmailOptions, EmailService } from '@/usecases/send-mail/ports'

class MailServiceStub implements EmailService {
  async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(mailOptions)
  }
}

class FailingMailServiceStub implements EmailService {
  async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
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
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailServiceStub, mailOptions)
    const userData: UserData = {
      name: 'any_name',
      email: 'any@mail.com'
    }
    const user = User.create(userData).value as unknown as User
    const response = await useCase.perform(user)
    expect(response).toBeInstanceOf(Right)
    expect((response.value as EmailOptions).to).toEqual(userData.name + ' <' + userData.email + '>')
  })

  test('should return error when email service fails', async () => {
    const failingMailServiceStub = new FailingMailServiceStub()
    const useCase = new SendEmail(failingMailServiceStub, mailOptions)
    const userData: UserData = {
      name: 'any name',
      email: 'any@mail.com'
    }
    const user = User.create(userData).value as unknown as User
    const response = await useCase.perform(user)
    expect(response).toBeInstanceOf(Left)
    expect((response.value as MailServiceError).message).toEqual('Mail service error.')
  })
})
