
export class ConnectionLib {


  constructor() { }

  /**
   * [call description] - function to emulate all services called by the controllers
   * @param  serviceName [description] - required class name
   * @param  method      [description] - name of the method we need to call (inside that class)
   * @param  data        [description] - data we need to pass, function param
   * @param  serviceMode [description] - type of service mock OR service
   */
  public call(serviceName: string, serviceMode: string) {
    let sName: string = serviceName.toLowerCase();
    let service: any = require(`../../../modules/${sName}/main/${serviceMode}s/${sName}.${serviceMode}`);
    return service.default;
  }

}
