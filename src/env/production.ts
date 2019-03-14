// production config

export const envConfig: any = {
    isMockData: false,
    cacheTimeout: 20,
    privateKey: 'myPrivateKey',
    database: {
        MONGODB_URI: 'mongodb://production_uri/',
        MONGODB_DB_MAIN: 'prod_db'
    },
    logger: {
      LEVEL: 'debug'
    }
};
