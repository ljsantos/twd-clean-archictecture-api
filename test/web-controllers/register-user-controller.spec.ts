import { UserData } from '@/entities'
import { UserRepository } from '@/use_cases/ports'
import { RegisterUserOnMailingList } from '@/use_cases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterUserController } from '@/web-controllers'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Sign up web controller', () => {
  test('should return status code 201 when request contais valid user data', async () => {
    const validRequest: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const controller: RegisterUserController = new RegisterUserController(usecase)
    const response: HttpResponse = await controller.handle(validRequest)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(validRequest.body)
  })
})
