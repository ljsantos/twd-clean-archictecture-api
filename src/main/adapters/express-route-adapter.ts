import { RegisterUserController } from '@/web-controllers'
import { Request, Response } from 'express'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { jsonFriendlyErrorReplacer } from '@/shared'

export const adaptRout = (controller: RegisterUserController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(JSON.stringify(httpResponse.body, jsonFriendlyErrorReplacer))
  }
}
