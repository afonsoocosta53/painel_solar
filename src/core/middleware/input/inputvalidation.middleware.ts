import { Request, Response, NextFunction } from 'express';
import { default as config } from '../../../env/index';
import { InputValidator } from '../../libraries/inputvalidator/inputvalidator.lib';
import IUserModel from '../../../modules/painel_solar/user/models/user.model'
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';
import { UserInterface } from '../../../modules/painel_solar/user/interface/user.interface';

export class InputValidation {

    public static eventLogger: EventsEmitter;

    /**middleware that will check if the fields of the request are valid according to the configuration file
     * 
     * @param req - express.request - request object from express
     * @return    - Array           - return a array with the objects from the request already validated ex: [{"key: x", "value: y"}]   
     */
    public validate(req: UserInterface, res: Response, next: NextFunction) {
        InputValidation.eventLogger = new EventsEmitter('Validate Middleware');
        let path = req.path.split('/')[1];
        let fields = InputValidator.inputFields(req);
        if (config.inputConfig.hasOwnProperty(path)) {
            if (InputValidator.isRequired(fields, config.inputConfig[path])) {
                if (InputValidator.isValid(fields, config.inputConfig[path])) {
                    InputValidator.isUnique(fields, config.inputConfig[path], IUserModel).then((result) => {
                        if (result) {
                            if (InputValidator.validateFormField(fields, config.inputConfig[path])) {
                                req.fields = InputValidator.sanitizeFields(fields);
                                next();
                            } else {
                                res.status(401).json({
                                    err: 'Fill the fields correctly!'
                                });
                            }
                        } else {
                            res.status(401).json({
                                err: 'User already registered!'
                            })
                        }
                    }).catch((err) => {
                        res.status(500).json({
                            err: err
                        })
                    })
                } else {
                    res.status(401).json({
                        err: 'Fill all the required fields!'
                    });
                }
            } else {
                res.status(401).json({
                    err: 'Fill all the required fields!'
                });
            }
        } else {
            req.fields = fields;
            next();
        }

    }


}

export default new InputValidation();