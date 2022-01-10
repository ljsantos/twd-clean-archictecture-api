import { UserRepository } from '@/usecases/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { User, UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const user: User = User.create({ name, email }).value as unknown as User
    const response = (await registerUseCase.perform(user))
    const userAdded = await repo.findUserByEmail('any@email.com')
    expect(userAdded.name).toBe('any_name')
    expect(response.name).toBe('any_name')
  })
})
