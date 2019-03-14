import { Event } from "typescript.events";
import Logger from '../logger/logger.middleware';



export default class EventsEmitterMiddleware extends Event {
  private event: Event = this;
  private log: any;



  constructor(ref: string){
    super();
    this.log = Logger(ref);
    this.init(ref);
  }

 /**
 * [init description] - Start emitter
 * @param  ref [description] - event name who define the event
 */
  private init(ref: string){
    this.event.on(ref, (format: any) => {
      this.log[format.type](format.data ? format.data : '');
    });
  }


 /**
 * [$emit description]
 * @param  ref  [description] - event name
 * @param  type [description] - log type
 * @param  data [description] - data for show in log
 */
  public $emit(ref: any, type: string, data?: any[]){
    let newData: any = {
      type: type,
      data: data
    };
    this.event.emit(ref, newData);
  }

}
