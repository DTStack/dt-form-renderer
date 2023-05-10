import type {
    FormServicePoolType,
    FormServiceType,
} from '@dt-form-renderer/core';
import { getSourceListViaType } from '../mockApi';

const getDerivedValue: FormServiceType = function ({
    formData,
    extraData,
    trigger,
    args,
}) {
    console.log('invoke getDerivedValue', formData, extraData);
    return Promise.resolve();
};

const getSchemaList: FormServiceType = function ({
    formData,
    extraData,
    trigger,
    args,
}) {
    console.log('invoke getSchemaList', formData, extraData, args);
    if (!formData.sourceId || !formData.sourceType) return Promise.resolve([]);
    return Promise.resolve(
        [
            `${formData.sourceType}_schema_batch`,
            `${formData.sourceType}_schema_assets`,
        ].map((s) => ({ label: s, value: s })),
    );
};

const getTableList: FormServiceType = function ({
    formData,
    extraData,
    trigger,
    args,
}) {
    console.log('invoke getTableList', formData, extraData);
    console.log('FORM DATA ***', formData);
    console.log('EXTRA DATA ***', extraData);
    console.log('ARGS ***', args, typeof args);
    if (!formData.schema) return Promise.resolve([]);
    const result =
        formData.schema.endsWith === 'assets'
            ? [
                  `${formData.sourceType}_table_assets_meta`,
                  `${formData.sourceType}_table_assets_model`,
              ].map((s) => ({ label: s, value: s }))
            : [
                  `${formData.sourceType}_table_batch_meta`,
                  `${formData.sourceType}_table_batch_model`,
              ].map((s) => ({ label: s, value: s }));
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, 1000);
    });
};

const getTableLocationType: FormServiceType = function ({
    formData,
    extraData,
    trigger,
    args,
}) {
    console.log('invoke getTableLocationType', formData, extraData);
    if (!formData.tableName) return Promise.resolve(true);
    const result = (formData.tableName as string)?.endsWith('meta');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, 1000);
    });
};

const getHivePartitions: FormServiceType = function ({
    formData,
    extraData,
    trigger,
    args,
}) {
    console.log('invoke getHivePartitions', formData, extraData);
    if (!formData.tableName) return Promise.resolve([]);
    const result = (formData.tableName as string)?.endsWith('meta')
        ? [
              { label: 'pt_meta_1', value: 'pt_meta_1' },
              { label: 'pt_meta_2', value: 'pt_meta_2' },
          ]
        : [
              { label: 'pt_model_1', value: 'pt_model_1' },
              { label: 'pt_model_2', value: 'pt_model_2' },
          ];
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, 1000);
    });
};

const getPartitionDetail: FormServiceType = function ({
    formData,
    extraData,
    trigger,
    args,
}) {
    console.log('invoke getPartitionDetail', formData, extraData);
    if (!formData.tableName) return Promise.resolve([]);
    const result = (formData.tableName as string)?.endsWith('meta')
        ? [
              { label: 'pt_meta_1', value: 'pt_meta_1' },
              { label: 'pt_meta_2', value: 'pt_meta_2' },
          ]
        : [
              { label: 'pt_model_1', value: 'pt_model_1' },
              { label: 'pt_model_2', value: 'pt_model_2' },
          ];
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result);
        }, 1000);
    });
};

const formServicePool: FormServicePoolType = {
    getSchemaList,
    getTableList,
    getHivePartitions,
    getTableLocationType,
    getPartitionDetail,
    getDerivedValue,
};

export default formServicePool;
