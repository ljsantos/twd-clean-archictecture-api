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
    if (!(request.body.name)) {
      const missingParam = 'name'
      return badRequest(new MissingParamError(missingParam))
    }

    if (!(request.body.email)) {
      const missingParam = 'email'
      return badRequest(new MissingParamError(missingParam))
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
