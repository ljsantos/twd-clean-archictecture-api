import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/use_cases/ports'
import { EmailOptions, EmailService } from '@/use_cases/send-mail/ports'

export class SendEmail implements UseCase {
  private readonly emailService: EmailService
  private emailOptions: EmailOptions
  constructor (emailService: EmailService, emailOptions: EmailOptions) {
    this.emailService = emailService
    this.emailOptions = emailOptions
  }

  async perform (request: UserData): Promise<any> {
    const user: UserData = request
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    this.emailOptions.to = user.name + ' <' + user.email + '>'
    const response = await this.emailService.send(this.emailOptions)
    if (response.isLeft()) {
      return left(response.value)
    }
    return right(response.value)
  }
}
