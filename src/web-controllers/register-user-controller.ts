import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/use_cases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created } from '@/web-controllers/utils'
import { MissingParamError } from './errors'

export class RegisterUserController {
  private readonly usecase: RegisterUserOnMailingList

  constructor (usecase: RegisterUserOnMailingList) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
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
    const response = await this.usecase.RegisterUserOnMailingList(userData)
    if (response.isLeft()) {
      return badRequest(response.value)
    }
    if (response.isRight()) {
      return created(response.value)
    }
  }
}
