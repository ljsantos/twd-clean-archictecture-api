import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

describe('Mongodb User repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()
    const user = {
      name: 'Any Name',
      email: 'any@mail.com'
    }
    await userRepository.add(user)
    expect(await userRepository.exists(user)).toBeTruthy()
  })

  test('shoul return all added user when find all users', async () => {
    const userRepository = new MongodbUserRepository()
    const user = {
      name: 'Any Name',
      email: 'any@mail.com'
    }
    const otherUser = {
      name: 'Other User',
      email: 'other@mail.com'
    }

    await userRepository.add(user)
    await userRepository.add(otherUser)
    const allUsers = await userRepository.findAllUsers()
    expect(allUsers[0].name).toEqual('Any Name')
    expect(allUsers[1].name).toEqual('Other User')
  })
})
