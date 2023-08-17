import { ValidatePlugin, Diagnostic, DiagnosticLevel } from '../validator';

const checkRequiredConf: ValidatePlugin = function (fieldsConfig) {
    const title = 'Required Property Check';
    const diagnostics: Diagnostic[] = [];
    const fieldNamesCache = [];
    fieldsConfig.forEach((fieldConf, index) => {
        const { fieldName, widget, label } = fieldConf;
        if (!fieldName) {
            diagnostics.push({
                level: DiagnosticLevel.Error,
                message: `fieldName property can not be empty! please check \`fieldList[${index}].fieldName\`.`,
                title,
                location: [index],
            });
        }
        if (typeof fieldName !== 'string') {
            diagnostics.push({
                level: DiagnosticLevel.Error,
                message: `fieldName property must be a string! please check \`fieldList[${index}].fieldName\`.`,
                title,
                location: [index],
            });
        }
        if (!widget) {
            diagnostics.push({
                level: DiagnosticLevel.Error,
                message: `widget property can not be empty! please check \`fieldList[${index}].widget\`.`,
                title,
                location: [index],
            });
        }
        if (typeof widget !== 'string') {
            diagnostics.push({
                level: DiagnosticLevel.Error,
                message: `widget property must be a string! please check \`fieldList[${index}].widget\`.`,
                title,
                location: [index],
            });
        }
        if (!label) {
            diagnostics.push({
                level: DiagnosticLevel.Warn,
                message: `label property should not empty! please check \`fieldList[${index}].widget\`.`,
                title,
                location: [index],
            });
        }
        if (fieldNamesCache.includes(fieldName)) {
            diagnostics.push({
                level: DiagnosticLevel.Warn,
                message: `there are duplicate fieldName property named \`${fieldName}\` in the fieldList! please check \`fieldList[${index}].fieldName\`.`,
                title,
                location: [index],
            });
        } else {
            fieldNamesCache.push(fieldName);
        }
    });
    return diagnostics;
};

export default checkRequiredConf;
