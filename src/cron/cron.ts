import { CronJob } from 'cron';
import Logger from '../core/middleware/logger/logger.middleware';
import axios from 'axios';
import { default as config } from '../env/index';
import { PathsLib } from '../core/libraries/paths/paths.lib';
import IHistoryDataModel from '../modules/painel_solar/history_data/models/history_data_model';
import { HistoryDataModel } from '../modules/painel_solar/history_data/models/history_data_model';
import IUserModel from '../modules/painel_solar/user/models/user.model';
import { UserModel } from '../modules/painel_solar/user/models/user.model';




const TEST_CRON_INTERVAL: string = '*/1 * * * * *';
const CRON_INTERVAL_DATA_HISTORY: string = '*/1 * * * *';
const log = Logger('Cron');

/**
 * @class Cron
 * [Cron description] - this is where you create new cron jobs
 */
export default class Cron {
  private static expiresIn: number = 0;


  /**
   * [testCron description] - default example cron job
   */
  private static testCron(): void {
    new CronJob(TEST_CRON_INTERVAL, (): void => {
      log.info('Hello, I am Cron! Please see ./cron/cron.ts');
    },
      null,
      true);
  }



  private static generateData(): void {
    new CronJob(CRON_INTERVAL_DATA_HISTORY, () => {
      let userModel: UserModel = new UserModel();
      userModel.listUsers(IUserModel).then((users: any) => {
        users.forEach(user => {
          let historyInfo: any = {
            user_id: user._id,
            power_generated: 1,
            money_generated: 1
          }
          let historyModel: HistoryDataModel = new HistoryDataModel();
          historyModel.checkHistory({ user_id: historyInfo.user_id }, IHistoryDataModel).then(result => {
            if (!result) {
              historyModel.newHistoryData(historyInfo, IHistoryDataModel).then(() => {
                console.log("NEW DATA SAVED");
              })
            } else {
              historyModel.updateHistory(result, historyInfo, IHistoryDataModel).then(() => {
                console.log("DATA UPDATED");
              })
            }
          }).catch(err => {
            console.log("err");
          })
        })
      })

    },
      null,
      true);
  }


  /**
   * [init description] - start cron on ../server/init.server.ts
   */
  static init(): void {
    log.info('Cron jobs started...');
    Cron.generateData();
  }
}
