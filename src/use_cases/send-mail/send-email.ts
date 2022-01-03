import { left, right } from '@/shared'
import { UseCase } from '@/use_cases/ports'
import { EmailOptions, EmailService } from './ports'

export class SendEmail implements UseCase {
  private readonly emailService: EmailService
  constructor (emailService: EmailService) {
    this.emailService = emailService
  }

  async perform (request: EmailOptions): Promise<any> {
    const mailOptions: EmailOptions = request
    const response = await this.emailService.send(mailOptions)
    if (response.isLeft()) {
      return left(response.value)
    }
    return right(response.value)
  }
}
