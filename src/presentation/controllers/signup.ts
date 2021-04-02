import { MissingParamError } from '../errors/missing-param'
import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { IEmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param'

export class SignUpController implements Controller {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFileds = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFileds) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return { statusCode: 200, body: {} }
  }
}
