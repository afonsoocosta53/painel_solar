import config from './defaults';

// Load environment-specific settings
let localConfig: any = {};
let inputConfig: any = {};

try {
    // The environment file might not exist
    localConfig = require(`../env/${config.env}`);
    inputConfig = require(`../env/inputvalidation.setting`)
    localConfig = localConfig || {};
} catch (error) {
    localConfig = {};
    console.error('error', error);
}

// merge the config files
// localConfig will override defaults
export default (<any>Object).assign({}, config, localConfig, inputConfig);
