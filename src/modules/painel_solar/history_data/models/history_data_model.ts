import * as connections from '../../../../core/connections/mongodb.connection';
import { Schema, Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { default as config } from '../../../../env/index';
import IUserModel from '../../user/models/user.model';
import { UserModel } from '../../user/models/user.model';

/**
 * [IUserModel description] - Model creation
 */
export interface IHistoryDataModel extends Document {
    createdAt?: Date;
    updatedAt?: Date;
    user_id: string;
    total_power: number;
    total_money: number;
    date: Date;
}


/**
 * [UserSchema description] - Model Schema
 * @param  user_id       [description]
 * @param  total_power   [description]
 * @param  date          [description]
 * @param  total_money   [description]
 * @return               [description]
 */
const HistoryDataSchema: Schema = new Schema({
    user_id: {
        type: String
    },
    total_power: {
        type: Number
    },
    total_money: {
        type: Number
    },
    date: {
        type: Date
    }
}, {
        collection: 'historyData',
        versionKey: false
    }).pre('save', (next) => {
        // this will run before saving
        if (this._doc) {
            const doc: IHistoryDataModel = this._doc;
            const now: Date = new Date();

            if (!doc.createdAt) {
                doc.createdAt = now;
            }
            doc.updatedAt = now;
        }
        next();

        return this;
    });


export class HistoryDataModel {


    public checkHistory(dataUser, historyDataModel) {
        return new Promise((resolve, reject) => {
            historyDataModel.find({ user_id: Types.ObjectId(dataUser.user_id) }).exec((err, historyData) => {
                if (err) {
                    reject(err)
                }
                if (historyData.length != 0) {
                    historyData.forEach(history => {
                        let dt = new Date();
                        let date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
                        let historyDate = history.date.getFullYear() + "/" + (history.date.getMonth() + 1) + "/" + history.date.getDate();
                        if (historyDate === date) {
                            resolve(history);
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(false);
                }
            })
        })
    }

    public updateHistory(history, historyInfo, historyDataModel) {
        return new Promise((resolve, reject) => {
            let newHistoryInfo: any = {
                user_id: history.user_id,
                total_power: history.total_power + historyInfo.power_generated,
                total_money: history.total_money + historyInfo.money_generated
            }
            historyDataModel.updateOne({ _id: Types.ObjectId(history._id) }, {
                $set: newHistoryInfo
            }).exec((err, historyUpdated) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(historyUpdated)
                }
            })
        })
    }

    /**
     * 
   * @param  fields        - Array           - a array with fields
   * @param  questionModel - IUserModel      - the question model to look for
   * @return               - IQuestionModel  - the new question or a error  
     */
    public newHistoryData(historyInfo, historyDataModel) {
        return new Promise((resolve, reject) => {
            const historyData: any = {
                user_id: historyInfo.user_id,
                total_power: historyInfo.power_generated,
                total_money: historyInfo.money_generated,
                date: new Date()
            }
            const newHistoryData = new historyDataModel(historyData);
            newHistoryData.save((err, historyData) => {
                if (err) {
                    reject(err);
                } else {
                    let userModel: UserModel = new UserModel();
                    userModel.updateHistoryUser(historyData, IUserModel).then(result => {
                        if (result) {
                            resolve(historyData);
                        }
                    });
                }
            })
        })
    }

    public getHistory(historyID, historyDataModel) {
        return new Promise((resolve, reject) => {
            historyDataModel.find({ _id: Types.ObjectId(historyID) }).exec((err, historyData) => {
                if (err) {
                    reject(err)
                }
                if (!historyData) {
                    resolve(false);
                } else {
                    resolve(historyData);
                }
            })
        })
    }

    public getUserHistoryData(user_id, historyDataModel) {
        return new Promise((resolve, reject) => {
            historyDataModel.find({ user_id: Types.ObjectId(user_id) }).exec((err, historyData) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(historyData)
                }
            })
        })
    }


}


export default connections.db.model<IHistoryDataModel>('HistoryDataModel', HistoryDataSchema);
