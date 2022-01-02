import { UserRepository } from '../ports/user-repository'
import { InMemoryUserRepository } from '../../../test/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { UserData } from '../../entities/user-data'
import { RegisterUserOnMailingList } from '../../../test/usecases/register-user-on-mailing-list/register-user-on-mailing-list'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const response = await usecase.RegisterUserOnMailingList({ name, email })
    const user = await repo.findUserByEmail('any@email.com')
    expect(user.name).toBe('any_name')
    expect(response.value.name).toBe('any_name')
  })

  test('should not add user with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const invalidEmail = 'anyemail.com'
    const error = (await usecase.RegisterUserOnMailingList({ name: name, email: invalidEmail })).value as Error
    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual('Invalid e-mail: ' + invalidEmail + '.')
  })

  test('should not add user with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const invalidName = 'a'
    const email = 'any@email.com'
    const error = (await usecase.RegisterUserOnMailingList({ name: invalidName, email: email })).value as Error
    expect(error.name).toEqual('InvalidNameError')
    expect(error.message).toEqual('Invalid name: ' + invalidName + '.')
  })
})
