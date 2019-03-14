import { default as config } from '../../../../env/index';
import * as express from 'express';
import { UserModel } from '../models/user.model';
import IUserModel from '../models/user.model';
import EventsEmitter from '../../../../core/middleware/events-emitter/events-emitter.middleware';
import { InputValidator } from '../../../../core/libraries/inputvalidator/inputvalidator.lib';
import { UserInterface } from '../interface/user.interface';


export class UserController {
  public static eventLogger: EventsEmitter;


  constructor() {
  }


  /**
   *  this is the signUp endpoint
   * @param req - express.request - request object from express
   * @return    - IUserModel      - user
   */
  public signUp(req: UserInterface, res: express.Response, next: express.NextFunction): void {
    UserController.logMessage('User - SignUp', 'SignUp running fine!', 'info');
    let userClass: UserModel = new UserModel();
    userClass.createUser(req.fields, IUserModel).then((user) => {
      res.status(200).json({
        status: 'OK',
        user: user
      })
    }).catch((err) => {
      res.status(500).json({
        status: 'Internal error!',
        err: err
      })
    });
  }

  /**
   *  this is the get user endpoint
   * @param req - express.request - request object from express
   * @return    - IUserModel      - user
   */
  public getUser(req: UserInterface, res: express.Response, next: express.NextFunction): void {
    UserController.logMessage('User - Get User', 'Get User running fine!', 'info');
    let userClass: UserModel = new UserModel();
    userClass.findByID(req.fields, IUserModel).then((result) => {
      if (result) {
        res.status(200).json({
          status: 'OK',
          user: result
        });
      } else {
        res.status(404).json({
          err: 'User not found'
        });
      }
    }).catch((err) => {
      res.status(500).json({
        status: 'Internal error!',
        err: err
      })
    });
  }

  /**
   *  this is the update user endpoint
   * @param req - express.request - request object from express
   * @return    - IUserModel      - the updated user
   */
  public updateUser(req: UserInterface, res: express.Response, next: express.NextFunction): void {
    UserController.logMessage('User - Update User', 'Update User running fine!', 'info');
    let userClass: UserModel = new UserModel();
    userClass.findByID(req.fields, IUserModel).then((user) => {
      if (!user) {
        res.status(404).json({
          err: 'User not found'
        })
      }
      InputValidator.asValue_(req.fields, user).then((result) => {
        userClass.updateUser(req.fields, result, IUserModel).then((validation) => {
          res.status(200).json({
            status: 'OK',
            user: result
          });
        }).catch((err) => {
          res.status(500).json({
            err: 'Internal error!'
          });
        });
      });
    }).catch((err) => {
      res.status(500).json({
        status: 'Internal error!',
        err: err
      })
    });
  }

  /**
   *  this is the login endpoint
   * @param req - express.request - request object from express
   * @return    - JwtToken        - token to allow user to make requests    
   */
  public login(req: UserInterface, res: express.Response, next: express.NextFunction): void {
    UserController.logMessage('User - Login User', 'Login User running fine!', 'info');
    let userClass: UserModel = new UserModel();
    userClass.findByQuery(req.fields, IUserModel).then((user) => {
      if (!user) {
        res.status(404).json({
          err: 'User not found'
        });
      } else {
        userClass.isMatch(req.fields, user).then(() => {
          res.status(200).json({
            status: 'OK',
            user_id: user['id']

          });
        }).catch((err) => {
          res.status(401).json({
            status: 'Credentials invalid',
            err: err
          });
        })
      }
    }).catch((err) => {
      res.status(500).json({
        status: 'Internal error!',
        err: err
      })
    });
  }

  /**
   *  this is the delete user endpoint
   * @param req - express.request - request object from express
   * @return       
   */
  public deleteUser(req: UserInterface, res: express.Response, next: express.NextFunction): void {
    UserController.logMessage('User - Delete User', 'Delete User running fine!', 'info');
    let userClass: UserModel = new UserModel();
    userClass.deleteOne(req.fields, IUserModel).then(() => {
      res.status(200).json({
        status: 'OK'
      });
    }).catch((err) => {
      res.status(500).json({
        status: 'Internal error!',
        err: err
      })
    });
  }

  /**
   * this is the list users endpoint
   * @param req - express.request - request object from express
   * @return    - IUserModel      - Users collection
   */
  public listUsers(req: UserInterface, res: express.Response, next: express.NextFunction): void {
    UserController.logMessage('User - List Users', 'List Users running fine!', 'info');
    let userClass: UserModel = new UserModel();
    userClass.listUsers(IUserModel).then((users) => {
      if (users) {
        res.status(200).json({
          status: 'OK',
          users: users
        });
      } else {
        res.status(404).json({
          err: 'Users not found'
        });
      }
    }).catch((err) => {
      res.status(500).json({
        status: 'Internal error!',
        err: err
      })
    });
  }



  public static logMessage(cat, message, type) {
    UserController.eventLogger = new EventsEmitter(cat);
    UserController.eventLogger.$emit(cat, type, [message]);
  }

  private static getCacheKey(key: string) {
    return `/user${key}`;
  }

  public static _switchErros(value: any) {
    return new Promise((resolve) => {
      switch (value) {
        case '001': {
          resolve({ status: '200', message: { Success: true } });
        }
        case '002': {
          resolve({ status: '400', message: { err: 'User not found' } });
        }
        case '003': {
          resolve({ status: '200', message: { Sucess: 'My events empty!' } });
        }
        default: {
          resolve({ status: '200', message: value });
        }
      }
    })
  }
}

export default new UserController();
