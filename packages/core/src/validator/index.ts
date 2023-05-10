import { JsonConfigType } from '..';
import { checkDependencies, checkRequiredConf } from './plugins';
import ConfigValidator from './validator';

export function validate(fieldsConfig: JsonConfigType) {
    const configValidator = new ConfigValidator([
        checkDependencies,
        checkRequiredConf,
    ]);
    return configValidator.validate(fieldsConfig);
}
