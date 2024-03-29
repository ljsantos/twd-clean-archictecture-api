import { Either, left, right } from '@/shared'
import { Email } from '@/entities/email'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { Name, UserData } from '@/entities'

export class User {
    public readonly name: Name
    public readonly email: Email

    private constructor (name: Name, email: Email) {
      this.name = name
      this.email = email
    }

    static create (userData: UserData): Either<InvalidNameError|InvalidEmailError, User> {
      const nameOrError = Name.create(userData.name)
      if (nameOrError.isLeft()) {
        return left(nameOrError.value)
      }

      const emailOrError = Email.create(userData.email)

      if (emailOrError.isLeft()) {
        return left(emailOrError.value)
      }

      const name: Name = nameOrError.value as Name
      const email: Email = emailOrError.value as Email

      return right(new User(name, email))
    }
}
