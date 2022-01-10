import { NodemailerMailService } from '@/external/mail-services'
import { MailServiceError } from '@/usecases/errors'
import { EmailOptions } from '@/usecases/send-mail/ports'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'Test'
const fromEmail = 'from_email@mail.com'
const toName = 'any_name'
const toEmail = 'any_email@mail.com'
const subject = 'Test e-mail'
const emailBody = 'Hello world attachament test'
const emailBodyHtml = '<b>Hellow world attachment test</b>'
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'passwd',
  from: fromName + ' ' + fromEmail,
  to: toName + ' <' + toEmail + '>',
  subject: subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachment
}

jest.mock('nodemailer')
const nodemailer = require('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('Node mailer mail service adaptor', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('should return ok if email is sent', async () => {
    const nodemailer = new NodemailerMailService()
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toEqual(mailOptions)
  })

  test('shoul return error if email is not sent', async () => {
    const nodemailer = new NodemailerMailService()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})
