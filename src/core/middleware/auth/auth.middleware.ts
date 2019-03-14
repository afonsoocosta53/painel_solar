import { Request, Response, NextFunction } from 'express';
import * as Fs from 'fs';
import * as Util from 'util';
import { AuthLib } from '../../libraries/auth/auth.lib';



export class AuthMiddleware {
    private static readFile: any = Util.promisify(Fs.readFile);

    constructor() {
    }

    /**
     * [reqToken description] - check if token is present on headers request
     *                           and if token is valid
     * @param  req  [description] - tipical Nodejs Request param
     * @param  res  [description] - tipical Nodejs Response param
     * @param  next [description] - tipical Nodejs NextFunction param
     */
    public _validateToken(req: Request, res: Response, next: NextFunction) {
        let validToken: boolean = false
        let count = 0;
        if (AuthLib._asApiKey(req.headers.apikey)) {
            return AuthMiddleware.readFile('./src/env/api-keys.json').then(data => {
                let eventistics: any = JSON.parse(data);
                Object.keys(eventistics).forEach((key) => {
                    count++;
                    if (eventistics[key].key === req.headers.apikey) {
                        validToken = true;
                    }
                    count = count - 1;
                    if (count == 0) {
                        if (validToken) {
                            next();
                        } else {
                            res.status(401).json({
                                error: 'Unauthorized'
                            });
                        }
                    }
                });
            }).catch(err => {
                res.status(401).json({
                    error: 'Unauthorized',
                    err: err
                });
            });
        } else {
            res.status(401).json({
                error: 'Unauthorized'
            });
        }
    }





}

export default new AuthMiddleware();
