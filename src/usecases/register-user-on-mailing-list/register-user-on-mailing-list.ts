import { User, UserData } from '@/entities'
import { UseCase, UserRepository } from '@/usecases/ports'

export class RegisterUserOnMailingList implements UseCase {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async perform (request: User): Promise<UserData> {
    const userData = { name: request.name.value, email: request.email.value }
    if (!await this.userRepo.exists(userData)) {
      await this.userRepo.add(userData)
    }
    return userData
  }
}
