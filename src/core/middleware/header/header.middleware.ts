import { Request, Response, NextFunction } from 'express';


/**
 * @class HeaderMiddleware
 */
export class HeaderMiddleware {

  constructor(){
    this.headers = this.headers.bind(this);
  }

  /**
   * [headers description] - set headers for api endpoints
   * @param  req  [description] - tipical Nodejs Request param
   * @param  res  [description] - tipical Nodejs Response param
   * @param  next [description] - tipical Nodejs NextFunction param
   */
  public headers(req: Request, res: Response, next: NextFunction){
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With,' +
        'Content-Type, Accept,' +
        'Authorization,' +
        'Access-Control-Allow-Credentials'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  }

}

export default new HeaderMiddleware();
