import * as jsonwebtoken from 'jsonwebtoken';
import { default as config } from '../../../env/index';



export class JwtLib {
  private privateKey: string;


  constructor(){
    this.privateKey = config.envConfig.privateKey;
  }


  public isExpired(token: string){
    jsonwebtoken.verify(token, this.privateKey, (err, decoded) => {
      if(err){
        return err.name == 'TokenExpiredError';
      }
      return false;
    });
  }


  public isValid(token: string){
    return jsonwebtoken.verify(token, this.privateKey, (err, decoded) => {
      return err ? false : true;
    });
  }


  public validate(token: string){
    jsonwebtoken.verify(token, this.privateKey, (err, decoded) => {
      if(err){
        return err.message;
      }
      return 'isValid';
    });
  }


  public create(tokenData: any){
    return jsonwebtoken.sign({
      data: tokenData.username
    },
    this.privateKey,
    tokenData.exp);
  }

}
