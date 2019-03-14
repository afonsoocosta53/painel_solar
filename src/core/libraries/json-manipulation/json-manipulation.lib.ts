


export class JsonManipulationLib {


  /**
   * [isJson description]
   * @param  data [description] - any data we need to check if can be converted to json
   * @return      [description] - boolean, true if data param is converted to json and alse if not
   */
  public static isJson(data: any){
    try {
      JSON.parse(data);
    }catch(err){
      return false;
    }
    return true
  }



  /**
   * [getObjectById description] - Helper function to find a object in data array
   * @param  events   [description] - array of data where we need to search
   * @param  eventId  [description] - value of the property we need to find
   * @param  property [description] - name of the object property who want to find
   * @return          [description] - requested object OR empty object
   */
  public static getObjectById(events: any[], eventId: any, property: string){
    let index: number = events.findIndex(ev => ev[property] == eventId);
    if(index > -1){
      return events[index];
    }
    return {};
  }

}
