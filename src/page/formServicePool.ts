import { FormServicePool, IFormService } from "../core/services/serviceType"

const getSchemaList: IFormService = function (formData, extraData) {
    console.log('invoke getSchemaList', formData, extraData);
    return Promise.resolve([
        {label: 'schema_batch', value: 'schema_batch'}, 
        {label: 'schema_assets', value: 'schema_assets'}, 
    ])
}

const getTableList: IFormService = function (formData, extraData) {
    console.log('invoke getTableList', formData, extraData);
    if(!formData.schema) return Promise.resolve([])
    const result = formData.schema === "schema_assets"
        ? [
            {label: 'table_assets_meta', value: 'table_assets_meta'}, 
            {label: 'table_assets_model', value: 'table_assets_model'},  
        ]
        : [
            {label: 'table_batch_meta', value: 'table_batch_meta'}, 
            {label: 'table_batch_model', value: 'table_batch_model'}, 
        ]
    return Promise.resolve(result)
}

const getTableLocationType: IFormService = function (formData, extraData) {
    console.log('invoke getTableLocationType', formData, extraData);
    if(!formData.tableName) return Promise.resolve(true)
    const result = (formData.tableName as string)?.endsWith('meta')
    return Promise.resolve(result)
}

const getHivePartitions: IFormService = function (formData, extraData) {
    console.log('invoke getHivePartitions', formData, extraData);
    if(!formData.tableName) return Promise.resolve([])
    const result = (formData.tableName as string)?.endsWith('meta')
        ? [
            {label: 'pt_meta_1', value: 'pt_meta_1'}, 
            {label: 'pt_meta_2', value: 'pt_meta_2'},  
        ]
        : [
            {label: 'pt_model_1', value: 'pt_model_1'}, 
            {label: 'pt_model_2', value: 'pt_model_2'}, 
        ]
    return Promise.resolve(result)
}

const getPartitionDetail: IFormService = function (formData, extraData) {
    console.log('invoke getPartitionDetail', formData, extraData);
    if(!formData.tableName) return Promise.resolve([])
    const result = (formData.tableName as string)?.endsWith('meta')
        ? [
            {label: 'pt_meta_1', value: 'pt_meta_1'}, 
            {label: 'pt_meta_2', value: 'pt_meta_2'},  
        ]
        : [
            {label: 'pt_model_1', value: 'pt_model_1'}, 
            {label: 'pt_model_2', value: 'pt_model_2'}, 
        ]
    return Promise.resolve(result)
}

const formServicePool: FormServicePool = {
    getSchemaList,
    getTableList,
    getHivePartitions,
    getTableLocationType,
    getPartitionDetail,
}

export default formServicePool