import * as util from 'util';
import * as fs from 'fs';
import * as parser from 'xml2json-light';
import { default as config } from '../../../env/index';
import EventsEmitter from '../../../core/middleware/events-emitter/events-emitter.middleware';





export class PathsLib {

  constructor(){}


  public static path(endpoint: any, params: any, publicApi: boolean = false){
    if ('object' === typeof params && Object.keys(params).length) {
        Object.keys(params).forEach(p => {
            endpoint = endpoint.replace(`:${p}`, params[p]);
        });
    }
    return endpoint;
  }




  private static isJson(str: any){
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

}
