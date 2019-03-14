import { Request, Response, NextFunction } from 'express';
import { JwtLib } from '../../../core/libraries/jwt/jwt.lib';



export class JwtMiddleware {
  private jwt: JwtLib;

  constructor(){
    this.reqToken = this.reqToken.bind(this);
    this.jwt = new JwtLib();
  }

  /**
   * [reqToken description] - check if token is present on headers request
   *                           and if token is valid
   * @param  req  [description] - tipical Nodejs Request param
   * @param  res  [description] - tipical Nodejs Response param
   * @param  next [description] - tipical Nodejs NextFunction param
   */
  public reqToken(req: Request, res: Response, next: NextFunction){
    if(req.headers.hasOwnProperty('token')){
      if(!this.jwt.isValid(req.headers.token.toString())){
        res.status(401).json({
          error: 'Unauthorized'
        });
      }else{
        next();
      }
    }else{
      res.status(401).json({
        error: 'Unauthorized'
      });
    }
  }



  /**
   * [isAuthenticated description]
   * @param  req  [description]
   * @param  res  [description]
   * @param  next [description]
   * @return      [description]
   */
  public isAuthenticated(req: Request, res: Response, next: NextFunction){
    
  }

}

export default new JwtMiddleware();
