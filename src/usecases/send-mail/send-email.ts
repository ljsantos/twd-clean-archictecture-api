import { User } from '@/entities'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-mail/ports'
import { MailServiceError } from '@/usecases/errors'

export class SendEmail implements UseCase {
  private readonly emailService: EmailService
  private emailOptions: EmailOptions
  constructor (emailService: EmailService, emailOptions: EmailOptions) {
    this.emailService = emailService
    this.emailOptions = emailOptions
  }

  async perform (request: User): Promise<Either<MailServiceError, EmailOptions>> {
    const user: User = request

    this.emailOptions.to = user.name.value + ' <' + user.email.value + '>'
    const response = await this.emailService.send(this.emailOptions)
    if (response.isLeft()) {
      return left(response.value)
    }
    return right(response.value)
  }
}
