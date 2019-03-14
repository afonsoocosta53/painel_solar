import { default as config } from '../../../../env/index';
import * as express from 'express';
import EventsEmitter from '../../../../core/middleware/events-emitter/events-emitter.middleware';
import { HistoryDataModel } from '../models/history_data_model';
import IHistoryDataModel from '../models/history_data_model';

export class HistoryDataController {
    public static eventLogger: EventsEmitter;




    constructor() { }


    /**
     * this is the save event summary data endpoint
     * @param   req - express.request - request object from express
     * @return  - JSON 
     */
    public getHistoryData(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let historyModel: HistoryDataModel = new HistoryDataModel();
        historyModel.getUserHistoryData(req.params.user_id, IHistoryDataModel).then(historydata => {
            if (historydata) {
                res.status(200).json({
                    status: true,
                    history: historydata
                })
            } else {
                res.status(401).json({
                    status: false,
                    err: 'No History found'
                })
            }
        }).catch(err => {
            res.status(500).json({
                status: false,
                err: 'Internal Error!'
            })
        })
    }




    private static getCacheKey(key: string) {
        return `/event${key}`;
    }

    private static logger(eventLog: string, key: string, value: any) {
        let eventLogger = new EventsEmitter(eventLog);
        eventLogger.$emit(eventLog, key, value);
    }

}

export default new HistoryDataController();
