import { Response } from 'express'
import { error, success } from '../util/ResponseApi'

export abstract class ApiController {
  public success(res: Response, obj: any, message: string = '') {
    return res.status(201).json(success(obj, message))
  }
  public fail(res: Response, err: Error | string) {
    return res.status(401).json(error(err.toString()))
  }
  
  public unauthorized(res: Response, message: string = 'Unauthorized') {
    return res.status(403).json(error(message))
  }
}
