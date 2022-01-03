import { UserData } from '@/entities'
import { UserRepository } from '@/use_cases/ports'
import { MongoHelper } from './helper'

export class MongodbUserRepository implements UserRepository {
  async add (user: UserData): Promise<void> {
    const userCollection = await MongoHelper.getCollection('users')
    const exists = await this.exists(user)
    const _user: UserData = {
      name: user.name,
      email: user.email
    }
    if (!exists) {
      await userCollection.insertOne(_user)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection('users')
    const result = await userCollection.findOne({ email: email })
    return (result as unknown) as UserData
  }

  async findAllUsers (): Promise<UserData[]> {
    const result = (await MongoHelper.getCollection('users')).find().toArray()
    return (result as unknown) as UserData[]
  }

  async exists (user: UserData): Promise<boolean> {
    const result = await this.findUserByEmail(user.email)
    if (result === null) {
      return false
    }
    return true
  }
}
