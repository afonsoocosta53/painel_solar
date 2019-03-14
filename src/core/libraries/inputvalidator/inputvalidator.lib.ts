import { default as config } from '../../../env/index';
import { UserModel } from '../../../modules/painel_solar/user/models/user.model';
import * as bcrypt from 'bcrypt';
declare function escape(s: string): string;



export class InputValidator {

    /**
   * check if a req is not null or undefined
   * @param string - String  - the string to check
   * @return       - boolean 
   */
    public static checkNulls(string: string) {
        return string == null || string == undefined || string == '' ? false : true;
    }

    /**
     * validate if the fields of the request have the required regex pattern or the required lenght
     * @param  fields - Array   - the object with the fields to check
     * @param  config - JSON    - the configs to follow
     * @return        - boolean 
     */
    public static validateFormField(fields, config) {
        let validateField: boolean = true;
        if (config.hasOwnProperty('validate')) {
            fields.forEach(field => {
                if (!config.exclude.includes(field.key)) {
                    if (config.validate.hasOwnProperty(field.key)) {
                        let regexField = new RegExp(config.validate[field.key].match);
                        if (config.validate[field.key].type === 'regex') {
                            if (!regexField.test(field.value.toString())) {
                                validateField = false;
                            }
                        } else {
                            if (config.validate[field.key].type === 'lenght') {
                                if (field.value.length < config.validate[field.key].min || field.value.length > config.validate[field.key].max) {
                                    validateField = false;
                                }
                            }
                        }
                    }
                }
            })
            return validateField;
        } else {
            return validateField;
        }
    }

    /**
     * function to create the object with the fields of the request 
     * @param  req  - express.request - request object from express
     * @return      - fields          - the object with the keys and values ex: [{"key: x", "value: y"}]
     */
    public static inputFields(req) {
        const fields = [];
        if (Object.keys(req.body).length) {
            for (let field in req.body) {
                fields.push({
                    key: field,
                    value: req.body[field]
                })
            }
            return fields;
        }
        if (Object.keys(req.params).length) {
            for (let field in req.params) {
                fields.push({
                    key: field,
                    value: req.params[field]
                })
            }
            return fields;
        }
        return fields;
    }

    /**
     * function to check if the required fields of the config file are in the request 
     * @param  fields - Array   - the object with the fields to check
     * @param  config - JSON    - the configs to follow
     * @return        - boolean
     */
    public static isRequired(fields, config) {
        const reqFields = [];
        let required: boolean = true;
        if (config.hasOwnProperty('required')) {
            if (config.required.length > 1) {
                if (config.required != []) {
                    fields.forEach((fieldKey: any) => {
                        reqFields.push(fieldKey.key);
                    })
                    config.required.forEach(requiredField => {
                        if (reqFields.indexOf(requiredField) == -1) {
                            required = false;
                        }
                    })
                    return required
                } else {
                    return required
                }
            } else {
                if (config.required != []) {
                    fields.forEach((fieldKey: any) => {
                        reqFields.push(fieldKey.key);
                    })
                    if (reqFields.indexOf(config.required[0]) == -1) {
                        required = false;
                    }
                    return required
                } else {
                    return required
                }
            }
        } else {
            return required
        }
    }

    /**
     * function to check if the required fields of the config file are not null or undefined
     * @param  fields - Array   - the object with the fields to check
     * @param  config - JSON    - the configs to follow
     * @return        - boolean
     */
    public static isValid(fields, config) {
        let notNull: boolean = true;
        if (config.hasOwnProperty('required')) {
            fields.forEach(field => {
                config.required.forEach(requiredField => {
                    if (field.key === requiredField) {
                        if (!config.exclude.includes(field.key)) {
                            if (!this.checkNulls(field.value)) {
                                notNull = false;
                            }
                        }
                    }
                })
            })
            return notNull;
        }
        else {
            return notNull;
        }
    }

    /**
     * function to check if the data field is already registered in the database
     * @param  fields    - Array        - the object with the fields to check
     * @param  config    - JSON         - the configs to follow
     * @param  usermodel - IUserModel   - the user model to look for
     * @return           - boolean
     */
    public static isUnique(fields, configs, usermodel) {
        return new Promise((resolve, reject) => {
            let userClass: UserModel = new UserModel();
            let count = 0;
            let isUnique: boolean = true;
            if (configs.hasOwnProperty('unique') && configs.unique.length) {
                for (let unique of configs.unique) {
                    count++;
                    userClass.verifyField(fields, unique, usermodel).then((result) => {
                        if (!result) {
                            isUnique = false
                        }
                        count = count - 1;
                        if (count == 0) {
                            resolve(isUnique);
                        }
                    }).catch((err) => {
                        reject(err);
                    })
                }
            } else {
                resolve(true);
            }
        });
    }

    /**
     * function that will saniteze the fields of the object fields to avoid injections in the database
     * @param  fields - Array - the object with the fields to check
     * @return                - the object with sanitezed data
     */
    public static sanitizeFields(fields) {
        const sanitezedFields = [];
        for (let field of fields) {
            let sanitizedField = escape(field.value);
            sanitezedFields.push({
                key: field.key,
                value: sanitizedField
            });
        }
        return sanitezedFields;
    }


    /**
     * function to replace the data that a user didn't filled in the form with the already registered data in the database
     * @param  fields - Array       - the object with the fields to check
     * @param  user   - IUserModel  - the user to provide the data
     * @return                      - the user with the replaced data
     */
    public static asValue_(fields, user) {
        let editedUser = {
            first_name: !this.checkNulls(fields[fields.findIndex((item) => item.key == 'first_name')].value) ? user.first_name : fields[fields.findIndex((item) => item.key == 'first_name')].value,
            last_name: !this.checkNulls(fields[fields.findIndex((item) => item.key == 'last_name')].value) ? user.last_name : fields[fields.findIndex((item) => item.key == 'last_name')].value,
            company: !this.checkNulls(fields[fields.findIndex((item) => item.key == 'company')].value) ? user.company : fields[fields.findIndex((item) => item.key == 'company')].value,
            phone: !this.checkNulls(fields[fields.findIndex((item) => item.key == 'phone')].value) ? user.phone : fields[fields.findIndex((item) => item.key == 'phone')].value,
            email: !this.checkNulls(fields[fields.findIndex((item) => item.key == 'email')].value) ? user.email : fields[fields.findIndex((item) => item.key == 'email')].value,
            password: '',
            my_events: user.my_events
        }

        if (!this.checkNulls(fields[fields.findIndex((item) => item.key == 'password')].value)) {
            editedUser.password = user.password;
            return Promise.resolve(editedUser);
        } else {
            let saltRounds = config.envConfig.bcrypt.salt;
            return bcrypt.hash(fields[fields.findIndex((item) => item.key == 'password')].value, saltRounds).then(function (hash) {
                editedUser.password = hash;
                return editedUser;
            });

        }
    }
}