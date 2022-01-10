import { User, UserData } from '@/entities'
import { UseCase, UserRepository } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterUserController } from '@/web-controllers'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { MissingParamError } from '@/web-controllers/errors'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { SendEmail } from '@/usecases/send-mail'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { EmailService, EmailOptions } from '@/usecases/send-mail/ports'

class MailServiceMock implements EmailService {
  public timeSendEmailWasCalled = 0
  async send (mailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    this.timeSendEmailWasCalled++
    return right(mailOptions)
  }
}

describe('Sign up web controller', () => {
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

  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const mailServiceMock = new MailServiceMock()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(repo)
  const sendEmailUseCase = new SendEmail(mailServiceMock, mailOptions)
  const usecase: UseCase = new RegisterAndSendEmail(registerUserOnMailingListUseCase, sendEmailUseCase)
  const controller: RegisterUserController = new RegisterUserController(usecase)

  class ErrorThrowingUseCaseStub implements UseCase {
    async perform (request: any): Promise<any> {
      throw Error()
    }
  }
  const errorThrowingUseCaseStub: ErrorThrowingUseCaseStub = new ErrorThrowingUseCaseStub()

  test('should return status code 200 when request contais valid user data', async () => {
    const validRequest: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(validRequest)
    expect(response.statusCode).toEqual(200)
    expect((response.body as User).name.value).toEqual(validRequest.body.name)
    expect((response.body as User).email.value).toEqual(validRequest.body.email)
  })

  test('should return status code 400 when request contais invalid name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'E  ',
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithInvalidName)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contais invalid email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'invalidmail.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const requestWithoutNameParameter: HttpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithoutNameParameter)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const requestWithoutEmailParameter: HttpRequest = {
      body: {
        name: 'Any Name'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithoutEmailParameter)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing user name and email', async () => {
    const requestWithEmptyBody: HttpRequest = {
      body: {
      }
    }
    const response: HttpResponse = await controller.handle(requestWithEmptyBody)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name and email.')
  })

  test('should return status code 500 when server raises', async () => {
    const validRequest: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }
    const controller: RegisterUserController = new RegisterUserController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(validRequest)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
