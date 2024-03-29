import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { EmailOptions, EmailService } from '@/usecases/send-mail/ports'
import * as nodemailer from 'nodemailer'

export class NodemailerMailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    const transporter = nodemailer.createTransport(
      {
        host: options.host,
        port: options.port,
        auth: {
          user: options.username,
          pass: options.password
        }
      }
    )
    try {
      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      })
      return right(options)
    } catch (error) {
      return left(new MailServiceError())
    }
  }
}
