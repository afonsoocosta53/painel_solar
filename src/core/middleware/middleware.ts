import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { IServer } from '../../server/interface/server.interface';

import headersMiddleware from './header/header.middleware';


/**
 * [Middleware description] - this the api middleware
 * @class Middleware
 */
export default class Middleware {

    /**
     * [init description] - Start middleware and is called on ../../server/init.server.ts
     * @param server [description] - server
     */
    static init(server: IServer): void {

        // express middleware
        server.app.use(bodyParser.urlencoded({ extended: false }));
        server.app.use(bodyParser.json());
        server.app.use(cookieParser());
        server.app.use(compression());
        server.app.use(helmet());
        server.app.use(cors());
        // cors
        server.app.use(headersMiddleware.headers);

    }
}
