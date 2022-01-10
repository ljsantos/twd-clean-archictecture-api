import { UserData } from '@/entities'
import { UseCase } from '@/usecases/ports'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, ok, serverError } from '@/web-controllers/utils'
import { MissingParamError } from './errors'

export class RegisterUserController {
  private readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string[] = []
      if (!(request.body.name)) {
        missingParams.push('name')
      }

      if (!(request.body.email)) {
        missingParams.push('email')
      }

      if (missingParams.length > 0) {
        const missingParamResult = missingParams.join(', ').replace(/, ([^,]*)$/, ' and $1') // Substitui última vírgula por "and"
        return badRequest(new MissingParamError(missingParamResult))
      }

      const userData: UserData = request.body
      const response = await this.usecase.perform(userData)
      if (response.isLeft()) {
        return badRequest(response.value)
      }
      return ok(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
