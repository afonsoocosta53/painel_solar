import * as debug from 'debug';
import * as http from 'http';
import Server from './server/init.server';
import * as serverHandlers from './server/handlers.server';
import Logger from './core/middleware/logger/logger.middleware';



debug('ts-express:server');

const port: string | number | boolean = serverHandlers.normalizePort(process.env.PORT || 3000);
const log = Logger('Server');

Server.set('port', port);

log.info(`Server listening on port ${port}`);

const server: http.Server = http.createServer(Server);

// server listen
server.listen(port);

// server handlers
server.on(
    'error',
    (error) => serverHandlers.onError(error, port));
server.on(
    'listening',
    serverHandlers.onListening.bind(server));


interface Request {
    property: string;
}

