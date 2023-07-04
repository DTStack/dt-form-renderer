import type {
    FormServicePoolType,
    FormServiceType,
} from '@dt-form-renderer/core';

const getSourceList: FormServiceType = function (context) {
    const { formData, extraData, trigger, args } = context;
    console.info(
        '===== invoke getSourceList \n***** context is: ',
        context,
        '\n'
    );
    if (!formData.sourceType) return Promise.resolve([]);
    return Promise.resolve(
        [`${formData.sourceType}1`, `${formData.sourceType}2`].map((s) => ({
            label: s,
            value: s,
        }))
    );
};

const getSchemaList: FormServiceType = function (context) {
    const { formData } = context;
    console.info(
        '===== invoke getSchemaList \n***** context is: ',
        context,
        '\n'
    );
    if (!formData.sourceId || !formData.sourceType) return Promise.resolve([]);
    return Promise.resolve(
        [`${formData.sourceId}_schema1`, `${formData.sourceId}_schema2`].map(
            (s) => ({ label: s, value: s })
        )
    );
};

const getTableList: FormServiceType = function (context) {
    const { formData, extraData, trigger, args } = context;
    console.info(
        '===== invoke getTableList \n***** context is: ',
        context,
        '\n'
    );
    if (!formData.schema) return Promise.resolve([]);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                [`${formData.schema}_table1`, `${formData.schema}_table2`].map(
                    (s) => ({ label: s, value: s })
                )
            );
        }, 500);
    });
};

const formServicePool: FormServicePoolType = {
    getSchemaList,
    getTableList,
    getSourceList,
};

export default formServicePool;
