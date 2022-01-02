import { UserData } from '@/entities'
import { UseCase, UserRepository } from '@/use_cases/ports'
import { RegisterUserOnMailingList } from '@/use_cases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterUserController } from '@/web-controllers'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { MissingParamError } from '@/web-controllers/errors'

describe('Sign up web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const usecase: UseCase = new RegisterUserOnMailingList(repo)
  const controller: RegisterUserController = new RegisterUserController(usecase)

  class ErrorThrowingUseCaseStub implements UseCase {
    async perform (request: any): Promise<any> {
      throw Error()
    }
  }
  const errorThrowingUseCaseStub: ErrorThrowingUseCaseStub = new ErrorThrowingUseCaseStub()

  test('should return status code 201 when request contais valid user data', async () => {
    const validRequest: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(validRequest)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(validRequest.body)
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
