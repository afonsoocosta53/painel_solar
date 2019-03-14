import * as express from 'express';
import UserRouter from '../modules/painel_solar/user/routes/user.router';
import HistoryDataRouter from '../modules/painel_solar/history_data/routes/history_data.router';
import { IServer } from '../server/interface/server.interface';


/**
 * @class Routes
 *  [init description] - this is the main router,
 *  this where you can can add new endpoints to the api,
 *  you can create new modules on ../modules/*, you need to create a new folder with controllers and routes,
 *  SEE the user example on ../modules/user
 */
export default class Routes {

    /**
     * @param  {IServer} server
     * @returns void
     */
    static init(server: IServer): void {
        const router: express.Router = express.Router();

        server.app.use('/', router);

        //routes to eventistics user
        server.app.use('/user', new UserRouter().router);

        //routes to eventistics event
        server.app.use('/historyData', new HistoryDataRouter().router);
    }
}
