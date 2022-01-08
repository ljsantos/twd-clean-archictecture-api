import { UserRepository } from '@/usecases/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'

describe('Register user on mailing list use case', () => {
  test('should not add user with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const invalidEmail = 'anyemail.com'
    const error = (await usecase.perform({ name: name, email: invalidEmail })).value as Error
    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual('Invalid e-mail: ' + invalidEmail + '.')
  })

  test('should not add user with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const invalidName = 'a'
    const email = 'any@email.com'
    const error = (await usecase.perform({ name: invalidName, email: email })).value as Error
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual('Invalid name: ' + invalidName + '.')
  })
})
