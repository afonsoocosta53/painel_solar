import * as Fs from 'fs';
import * as Util from 'util';
import * as _ from 'lodash';
import { default as config } from '../../../env/index';
import axios from 'axios';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';



export class AuthLib {
  public static axios: any = axios;
  private static readFile: any = Util.promisify(Fs.readFile);
  private static writeFile: any = Util.promisify(Fs.writeFileSync);


  constructor() {
    AuthLib.axios.defaults.timeout = 5 * 60 * 1000;
  }


  /**
   * [setCookie description] - set required cookie to request headers and delete temporary Authorization,
   * NOTE - if run this method you need to run again setAuthHeader to set again Authorization token
   * @return [description]
   */
  public static setCookie() {
    if (AuthLib.axios.defaults) {
      delete AuthLib.axios.defaults.headers.common.Authorization;
      AuthLib.axios.defaults.headers.Cookie = config.envConfig.stubhub.COOKIE;
      // AuthLib.axios.defaults.headers.agent = agent;
    }
  }


  /**
   * [issetAuthHeader description] - check if auth token is set
   * @return [description] - true if set otherwise false
   */
  public static issetAuthHeader() {
    return AuthLib.axios ? ('undefined' !== typeof AuthLib.axios.defaults.headers.common['Authorization']) : false;
  }

  

  /**
     * function that will generate a uuid to a event
     * @param param - datamodel - model of database
     */
  public static genApiKey() {
    return new Promise((resolve, reject) => {
      let _s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
      let _isUnique = function (uuid) {
        return new Promise((resolve, reject) => {
          return AuthLib.readFile('./src/env/api-keys.json').then(data => {
            let eventistics: any = JSON.parse(data);
            Object.keys(eventistics).forEach((key) => {
              if (eventistics[key].key === uuid) {
                resolve(false);
              } else {
                resolve(true);
              }
            });
          }).catch(err => {
            reject(err);
          });
        });
      };
      let _new = _s4() + _s4() + _s4() + '-' + _s4() + _s4() + _s4() + _s4() + _s4();
      _isUnique(_new).then(result => {
        if (result) {
          let apikey = {
            "key": _new
          }
          return AuthLib.readFile('./src/env/api-keys.json').then(data => {
            let eventistics: any = JSON.parse(data);
            _.assign(eventistics.eventistics, apikey);
            AuthLib.writeFile('./src/env/api-keys.json', JSON.stringify(eventistics));
            resolve(_new);
          }).catch(err => {
            reject(err);
          });
        } else {
          return this.genApiKey();
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
     * [isAuthenticated description]
     * @param  req  [description]
     * @param  res  [description]
     * @param  next [description]
     * @return      [description]
     */
  public static _asApiKey(string: any) {
    return string == null || string == undefined || string == '' ? false : true;
  }
  /**
   * [logger description] - print message on console
   * @param  eventLog [description]
   * @param  key      [description]
   * @param  value    [description]
   * @return          [description]
   */
  private static logger(eventLog: string, key: string, value: any) {
    let eventLogger = new EventsEmitter(eventLog);
    eventLogger.$emit(eventLog, key, value);
  }
}
