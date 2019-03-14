import * as express from 'express';
import Routes from '../routes/init.routes';
import Middleware from '../core/middleware/middleware';
import Cron from '../cron/cron';

/**
 * @class Server
 */
export class Server {
    // set app to be of type express.Application
    public app: express.Application;

    constructor() {
        this.app = express();
        Cron.init();
        Middleware.init(this);
        Routes.init(this);
    }
}


// export
export default new Server().app;
