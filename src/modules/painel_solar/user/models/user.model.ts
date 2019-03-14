import * as connections from '../../../../core/connections/mongodb.connection';
import { Schema, Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { default as config } from '../../../../env/index';

/**
 * [IUserModel description] - Model creation
 */
export interface IUserModel extends Document {
    createdAt?: Date;
    updatedAt?: Date;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    history_data: any;
}


/**
 * [UserSchema description] - Model Schema
 * @param  username     [description]
 * @param  first_name   [description]
 * @param  last_name    [description]
 * @param  phone        [description]
 * @param  email        [description]
 * @param  password     [description]
 * @return              [description]
 */
const UserSchema: Schema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    history_data: []
}, {
        collection: 'user',
        versionKey: false
    }).pre('save', (next) => {
        // this will run before saving
        if (this._doc) {
            const doc: IUserModel = this._doc;
            const now: Date = new Date();

            if (!doc.createdAt) {
                doc.createdAt = now;
            }
            doc.updatedAt = now;
        }
        next();

        return this;
    });


export class UserModel {


    /**
   * get the information about a user by is _id
   * @param  fields    - Array        - a array with fields 
   * @param  usermodel - IUserModel   - the user model to look for
   * @return           - IuserModel   - the user or a error         
   */
    public findByID(fields, usermodel) {
        return new Promise((resolve, reject) => {
            usermodel.findById({ _id: Types.ObjectId(fields[fields.findIndex((item) => item.key == 'id')].value) }).exec((err, user) => {
                if (err) {
                    reject(err);
                } if (!user) {
                    resolve(false);
                } else {
                    resolve(user);
                }
            });
        });
    }

    /**
 * get the information about a user by is _id
 * @param  fields    - Array        - a array with fields 
 * @param  usermodel - IUserModel   - the user model to look for
 * @return           - IuserModel   - the user or a error         
 */
    public findByHeaderID(fields, usermodel) {
        return new Promise((resolve, reject) => {
            usermodel.findById({ _id: Types.ObjectId(fields) }).exec((err, user) => {
                if (err) {
                    reject(err);
                } if (!user) {
                    resolve(false);
                } else {
                    resolve(user);
                }
            });
        });
    }

    /**
   * delete a user by is _id
   * @param  fields    - Array        - a array with fields 
   * @param  usermodel - IUserModel   - the user model to look for
   * @return           - boolean      - error or sucess         
   */
    public deleteOne(fields, usermodel) {
        return new Promise((resolve, reject) => {
            usermodel.deleteOne({ _id: Types.ObjectId(fields[fields.findIndex((item) => item.key == 'id')].value) }).exec((err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }



    /**
  * get the information about a user by is email
  * @param  fields    - Array       - a array with fields 
  * @param  usermodel - IUserModel  - the user model to look for
  * @return           - IuserModel  - the user or a error         
  */
    public findByQuery(fields, usermodel) {
        return new Promise((resolve, reject) => {
            usermodel.findOne({ email: fields[fields.findIndex((item) => { return item.key == 'email' })].value }).exec((err, user) => {
                if (err) {
                    reject(err);
                }
                if (!user) {
                    resolve(false);
                } else {
                    resolve(user);
                }
            });
        });
    }

    /**
   * verify if the unique is already registered in the database
   * @param  fields    - Array       - a array with fields 
   * @param  unique    - String      - the field to check if is unique
   * @param  usermodel - IUserModel  - the user model to look for
   * @return           - boolean                   
   */
    public verifyField(fields, unique, usermodel) {
        return new Promise((resolve, reject) => {
            let queryParam = {};
            queryParam[unique] = fields[fields.findIndex((item) => { return item.key == unique })].value;
            usermodel.findOne(queryParam).exec((err, user) => {
                if (err) {
                    reject(err);
                }
                if (user) {
                    try {
                        if (user.id === fields[fields.findIndex((item) => { return item.key == 'id' })].value) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } catch{
                        resolve(false);
                    }

                } else {
                    resolve(true);
                }
            });
        });
    }


    /**
   * list all the users in the database
   * @param  usermodel - IUserModel - the user model to look for
   * @return           - IUserModel - Users collection
   */
    public listUsers(usermodel) {
        return new Promise((resolve, reject) => {
            usermodel.find().exec((err, users) => {
                if (err) {
                    reject(err);
                }
                if (!users) {
                    reject(false);
                }
                resolve(users);
            });
        });
    }

    /**
   * check if the password match with the user password
   * @param  fields - Array       - a array with fields containing the password to check
   * @param  user   - IUserModel  - the user to check if the password match
   * @return        - JwtToken    - token to allow user to make requests  
   */
    public isMatch(fields, user) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(fields[fields.findIndex((item) => { return item.key == 'password' })].value, user.password, function (err, isMatch) {
                if (isMatch) {
                    resolve(true);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
   * update a user seting the older user data to the object result data
   * @param  fields    - Array       - a array with fields
   * @param  result    - IUserModel  - the object with the changed information
   * @param  usermodel - IUserModel  - the user model to look for
   * @return           - boolean          
   */
    public updateUser(fields, result, usermodel) {
        return new Promise((resolve, reject) => {
            usermodel.updateOne({ _id: Types.ObjectId(fields[fields.findIndex((item) => { return item.key == 'id' })].value) }, {
                $set: result
            }).exec((err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    /**
   * create a new user in the database
   * @param  fields    - Array       - a array with fields
   * @param  usermodel - IUserModel  - the user model to look for
   * @return           - IuserModel  - the new user or a error     
   */
    public createUser(fields, usermodel) {
        return new Promise((resolve, reject) => {
            this.encryptPassword(fields[fields.findIndex((item) => { return item.key == 'password' })].value).then((hash) => {
                let user: any = {
                    first_name: fields[fields.findIndex((item) => { return item.key == 'first_name' })].value,
                    last_name: fields[fields.findIndex((item) => { return item.key == 'last_name' })].value,
                    phone: fields[fields.findIndex((item) => { return item.key == 'phone' })].value,
                    email: fields[fields.findIndex((item) => { return item.key == 'email' })].value,
                    password: hash,
                    history_data: []
                };
                let newUser = new usermodel(user);
                newUser.save((err, user) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public updateHistoryUser(historyInfo, userModel) {
        return new Promise((resolve, reject) => {
            this.findByHeaderID(historyInfo.user_id, userModel).then((result: any) => {
                result.history_data.push(historyInfo._id);
                userModel.updateOne({ _id: Types.ObjectId(historyInfo.user_id) }, { $set: result }).exec((err, update) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (!update) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                })
            })
        })
    }

    /**
   * encrypt the user password
   * @param  password - String - the password to encrypt
   * @return          - String - the encrypted password
   */
    public encryptPassword(password) {
        let saltRounds = config.envConfig.bcrypt.salt;
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds).then((hash) => {
                resolve(hash);
            }).catch((err) => {
                reject(err);
            });
        });
    }



}


export default connections.db.model<IUserModel>('UserModel', UserSchema);
