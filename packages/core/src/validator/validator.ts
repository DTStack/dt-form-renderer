import { JsonConfigType, JsonConfigFieldType } from '..';

export enum DiagnosticLevel {
    Info = 1,
    Warn,
    Error,
}

export interface Diagnostic {
    level: DiagnosticLevel;
    message: string;
    location: (string | number)[];
    title: string;
}

export type ValidatePlugin = (
    fieldsConfig: JsonConfigFieldType[]
) => Diagnostic[];

class ConfigValidator {
    constructor(plugins?: ValidatePlugin[]) {
        this._plugins = plugins;
    }

    private _diagnosticsSet = new Set<Diagnostic>();
    private _plugins: ValidatePlugin[] = [];

    applyPlugin(plugin: ValidatePlugin) {
        this._plugins.push(plugin);
    }

    basicValidate(config: JsonConfigType) {
        if (!config?.fieldList) {
            this._diagnosticsSet.add({
                level: DiagnosticLevel.Error,
                message: 'Top level property: fieldList is not found!',
                location: [],
                title: 'Base Check',
            });
            return false;
        }
        if (!Array.isArray(config.fieldList)) {
            this._diagnosticsSet.add({
                level: DiagnosticLevel.Error,
                message: 'Top level property: fieldList must be an Array!',
                location: [],
                title: 'Base Check',
            });
            return false;
        }
        return true;
    }

    validate(config: JsonConfigType) {
        this._diagnosticsSet.clear();
        const pass = this.basicValidate(config);
        if (!pass) return Array.from(this._diagnosticsSet);

        this._plugins.forEach((plugin) => {
            const diagnostics = plugin(config.fieldList ?? []);
            diagnostics.forEach((d) => this._diagnosticsSet.add(d));
        });
        return Array.from(this._diagnosticsSet);
    }
}

export default ConfigValidator;
