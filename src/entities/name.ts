import { Either, left, right } from '../shared'
import { InvalidNameError } from './errors'

export class Name {
    public readonly value: string

    private constructor (value: string) {
      this.value = value
    }

    public static create (name: string): Either<InvalidNameError, Name> {
      if (!this.validate(name)) {
        return left(new InvalidNameError(name))
      }
      return right(new Name(name))
    }

    public static validate (name: string): boolean {
      if (!name) {
        return false
      }

      if (name.trim().length < 2) {
        return false
      }

      if (name.trim().length > 256) {
        return false
      }

      return true
    }
}
