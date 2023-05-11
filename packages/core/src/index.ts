import FormRenderer from './components/formRenderer';
import ConfigValidator, { DiagnosticLevel } from './validator/validator';

export type { ExtraDataRefType } from './extraDataContext';
export type { FormRendererProps } from './components/formRenderer';
export type { GetWidgets } from './components/formItemWrapper';
export type { Diagnostic, ValidatePlugin } from './validator/validator';
export * from './type';

export { validate } from './validator';
export { ConfigValidator, DiagnosticLevel };
export {
    checkDependencies as checkDependenciesPlugin,
    checkRequiredConf as checkRequiredConfPlugin,
} from './validator/plugins';

export default FormRenderer;
