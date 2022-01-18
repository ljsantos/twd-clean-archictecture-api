import { EmailOptions } from '@/usecases/send-mail/ports'

const attachments = [{
  filename: 'text.txt',
  path: '../../resources.txt'
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Lucas J Santos <teste@mailteste.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: from,
    to: to,
    subject: 'Mensagem de teste',
    text: 'Teste da mensagem',
    html: '<b> Esseé um texto html.</b>',
    attachments: attachments
  }
  return mailOptions
}
