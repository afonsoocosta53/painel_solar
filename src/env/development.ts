// development config

export const envConfig: any = {
  isMockData: false,
  cacheTimeout: 20,
  privateKey: 'myPrivateKey',
  database: {
    MONGODB_URI: 'mongodb://127.0.0.1:27017/',
    MONGODB_DB_MAIN: 'painel_solar3'
  },
  logger: {
    LEVEL: 'debug'
  },
  cache: {
    mode: 'nodeCache',
    redis: {
      host: '127.0.0.1',
      prefix: 'eventAnalizer',
      auth_pass: '',
      expire: 20,
      type: 'json'
    },
    nodeCache: {
      deleteOnExpire: true,
      stdTTL: 20,
      checkperiod: 21
    }
  },
  bcrypt: {
    salt: 10
  }
};
