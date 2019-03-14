import * as winston from 'winston';
import * as colors from 'colors';
import { default as config } from '../../../env/index';



// winston level configuration
winston.level = config.envConfig.logger.LEVEL;


class LoggerMiddleware {
  private name: string;

  /**
   * @param name [description] - reference to the class that write the log
   */
  constructor(name: string) {
    this.name = name;
    winston.cli.apply();
  }

  /**
   * [debug, info, warn, error description] - log
   * @param  format    [description] - description of the log
   * @param  ...params [description] - any additional values that you can need to pass
   */
  debug(format: string, ...params: any[]) {
    winston.log.apply(this, ['help', this.name + ' :: ' + format].concat(params));
  }

  info(format: string, ...params: any[]) {
    winston.log.apply(this, ['info', this.name + ' :: ' + format ].concat(params));
  }

  warn(format: string, ...params: any[]) {
    winston.log.apply(this, ['warn', this.name + ' :: ' + format].concat(params));
  }

  error(format: string, ...params: any[]) {
    winston.log.apply(this, ['error', this.name + ' :: ' + format].concat(params));
  }
}

export default (name: string) => {
  return new LoggerMiddleware(name);
}
