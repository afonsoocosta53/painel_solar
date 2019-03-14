import constants from './constants';

/** file with the configurations to the inputvalidator middleware
 * to add the middleware to a route also should add the variables to check
 * when add the variable to check it should have exclude: [] inside the object to avoid errors
 * [required] - will check if the field is present in the body or params of the request and also check if doesn't comes null
 * [validate] - will check if the field match the condition defined, only can check for regex or lenght
 * [unique]   - will check if the value of the field is alredy registered in the database
 * [exclude]  - will exclude the field to be checked in the validate and allow the field to be null
 */

export const inputConfig: any = {

    signUp: {
        required: ['password', 'email', 'first_name', 'last_name'],
        validate: {
            first_name: { type: 'regex', match: constants.FIRST_NAME_REGEX },
            last_name: { type: 'regex', match: constants.LAST_NAME_REGEX },
            email: { type: 'regex', match: constants.EMAIL_REGEX },
            password: { type: 'lenght', min: 0, max: 32 }
        },
        unique: ['email'],
        injections: ['all'],
        exclude: []
    },
    updateUser: {
        required: ['username', 'password', 'email', 'first_name', 'last_name'],
        validate: {
            username: { type: 'regex', match: constants.USERNAME_REGEX },
            first_name: { type: 'regex', match: constants.FIRST_NAME_REGEX },
            last_name: { type: 'regex', match: constants.LAST_NAME_REGEX },
            phone: { type: 'regex', match: constants.PHONE_REGEX },
            email: { type: 'regex', match: constants.EMAIL_REGEX },
            password: { type: 'lenght', min: 0, max: 32 },
            company: { type: 'lenght', min: 0, max: 250 }
        },
        unique: ['username', 'email'],
        injections: ['all'],
        exclude: ['id']
    },
    login: {
        required: ['email', 'password'],
        validate: {
            email: { type: 'regex', match: constants.EMAIL_REGEX },
            password: { type: 'lenght', min: 0, max: 32 }
        },
        injections: ['all'],
        exclude: []
    },
    addMyEvent: {
        required: ['id', 'event_id'],
        exclude: []
    },
    saveEventDetails: {
        required: ['id'],
        exclude: []
    },
    saveEventAnalytics: {
        required: ['id'],
        exclude: []
    }
}
