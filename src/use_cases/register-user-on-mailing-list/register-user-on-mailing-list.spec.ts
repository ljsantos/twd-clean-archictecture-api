import { UserRepository } from '../ports/user-repository'
import { InMemoryUserRepository } from './repository/in-memory-user-repository'
import { UserData } from '../../entities/user-data'
import { RegisterUserOnMailingList } from './register-user-on-mailing-list'
import { InvalidEmailError } from '../../entities/errors/invalid-email-error'
import { left } from '../../shared/either'
import { InvalidNameError } from '../../entities/errors/invalid-name-error'

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
    const email = 'anyemail.com'
    const response = await usecase.RegisterUserOnMailingList({ name, email })
    expect(response).toEqual(left(new InvalidEmailError()))
  })

  test('should not add user with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'a'
    const email = 'any@email.com'
    const response = await usecase.RegisterUserOnMailingList({ name, email })
    expect(response).toEqual(left(new InvalidNameError()))
  })
})
