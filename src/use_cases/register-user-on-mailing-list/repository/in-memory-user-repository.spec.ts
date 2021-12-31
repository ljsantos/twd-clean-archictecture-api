import { UserData } from "../user-data"
import { InMemoryUserRepository } from "./in-memory-user-repository"

describe('In memory User repository', () => {
    test('should return null if user is not found', async () => {
        const users: UserData[] = []
        const userRepo = new InMemoryUserRepository(users)
        const user = await userRepo.findUserByEmail('anymail.com')
        expect(user).toBeNull()
    })

    test('should return user if it is found in the repository', async () => {
        const name = 'any_name'
        const email = 'any@mail.com'
        const users: UserData[] = [{name, email}]
        const userRepo = new InMemoryUserRepository(users)
        const user = await userRepo.findUserByEmail('any@mail.com')
        expect(user.name).toBe('any_name')
    })

    test('should return true if a user is found in the repository', async () => {
        const name = 'any_name'
        const email = 'any@mail.com'
        const users: UserData[] = [{name, email}]
        const userRepo = new InMemoryUserRepository(users)
        const response = await userRepo.exists({name, email})
        expect(response).toBeTruthy
    })

    test('should include a user in repo if it is added', async () => {
        const name = 'any_name'
        const email = 'any@mail.com'
        const users: UserData[] = []
        const userAdd: UserData = {name, email}
        const userRepo = new InMemoryUserRepository(users)
        userRepo.add(userAdd)
        const response = await userRepo.exists({name, email})
        expect(response).toBeTruthy

    })
})