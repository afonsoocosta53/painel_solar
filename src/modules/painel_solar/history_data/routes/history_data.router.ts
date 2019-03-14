import { Router } from 'express';
import HistoryDataController from '../controllers/history_data';
import InputValidation from '../../../../core/middleware/input/inputvalidation.middleware';
import AuthMiddleware from '../../../../core/middleware/auth/auth.middleware';



export default class HistoryDataRouter {
    public router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }

    /**
     * [routes description] - define the router endpoints
     */
    public routes(): void {

        //History Data Router
        this.router.get('/:user_id', AuthMiddleware._validateToken, HistoryDataController.getHistoryData);

    }
}
