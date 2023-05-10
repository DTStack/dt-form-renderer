import { Plugin, Diagnostic, DiagnosticLevel } from '../validator';

const checkDependencies: Plugin = function (fieldsConfig) {
    const title = 'Dependencies Property Check';
    const diagnostics: Diagnostic[] = [];
    const allFieldNames = fieldsConfig.map((item) => item.fieldName);

    fieldsConfig.forEach((fieldConf, index) => {
        const { dependencies } = fieldConf;
        if (!dependencies?.length) return;
        const dependenciesCache = [];
        dependencies.forEach((dep, idx) => {
            if (!allFieldNames.includes(dep)) {
                diagnostics.push({
                    title,
                    level: DiagnosticLevel.Warn,
                    message: `\`${dep}\` is not a fieldName! Please check filedList[${index}].dependencies[${idx}]`,
                    location: [index, 'dependencies', idx],
                });
            }
            if (!dependenciesCache.includes(dep)) {
                dependenciesCache.push(dep);
            }
        });
        if (dependenciesCache.length !== dependencies.length) {
            diagnostics.push({
                title,
                level: DiagnosticLevel.Warn,
                message: `there are duplicate dependence in \`fieldList[${index}].dependencies\`.`,
                location: [index, 'dependencies'],
            });
        }
    });

    return diagnostics;
};

export default checkDependencies;
