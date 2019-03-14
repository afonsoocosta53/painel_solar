import * as mongoose from 'mongoose';
import { default as config } from '../../env/index';
import Logger from '../middleware/logger/logger.middleware';
import { Db } from 'mongodb';


interface connectOptions {
    autoReconnect: boolean;
    reconnectTries: number; // Never stop trying to reconnect
    reconnectInterval: number;
    loggerLevel?: string;
}
const connectOptions: connectOptions = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
};

const MONGO_URI: string = `${config.envConfig.database.MONGODB_URI}${config.envConfig.database.MONGODB_DB_MAIN}`;
export const db: mongoose.Connection = mongoose.createConnection(MONGO_URI, connectOptions);
/** 
 * [Logger description] - logger for MongoDB handlers
 */
const log = Logger('MongoDB');

/**
 * MongoDB handlers
 */
db.on('connecting', () => {
    log.info('connecting');
});

db.on('error', (error) => {
    log.error('connection', [error]);
    log.info('please check "./env/development.ts" file.');
    mongoose.disconnect();
});

db.on('connected', () => {
    log.info('connected');
});

db.once('open', () => {
    log.info('connection opened');
});

db.on('reconnected', () => {
    log.info('reconnected');
});

db.on('reconnectFailed', () => {
    log.warn('reconnectFailed');
});

db.on('disconnected', () => {
    log.info('disconnected');
});

db.on('fullsetup', () => {
    log.info('reconnecting...');
});
