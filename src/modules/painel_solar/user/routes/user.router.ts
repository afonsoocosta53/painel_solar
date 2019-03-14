import AuthController from '../controllers/user.controller';
import { Router } from 'express';
import InputValidation from '../../../../core/middleware/input/inputvalidation.middleware';
import AuthMiddleware from '../../../../core/middleware/auth/auth.middleware';


export default class UserRouter {
    public router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }

    /**
     * [routes description] - define the router endpoints
     */
    public routes(): void {
        this.router.post('/signUp', AuthMiddleware._validateToken, InputValidation.validate, AuthController.signUp);
        this.router.get('/getUser/:id', AuthMiddleware._validateToken, InputValidation.validate, AuthController.getUser);
        this.router.post('/updateUser', AuthMiddleware._validateToken, InputValidation.validate, AuthController.updateUser);
        this.router.delete('/deleteUser', AuthMiddleware._validateToken, InputValidation.validate, AuthController.deleteUser);
        this.router.get('/listUsers', AuthMiddleware._validateToken, AuthController.listUsers);
        this.router.post('/login', AuthMiddleware._validateToken, InputValidation.validate, AuthController.login);
    }
}
