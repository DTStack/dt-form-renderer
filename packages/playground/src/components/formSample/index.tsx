import React, { useEffect, useRef } from 'react';
import { Form, Select, Input } from 'antd';
import FormRenderer from '@datasync-form-renderer/core';
import formServicePool from './support/formServicePool';
import ruleMap from './support/formRuleMap';
import getWidgets from './support/getWidgets';
import { FormInstance } from 'antd/es/form/Form';
import docsMap from './support/doc';

const FormItem = Form.Item;

interface IProps {
    parsedJson: any[];
    initialValues: any;
}

const sourceList = [
    { label: 'hive_1', value: 1, type: 'hive' },
    { label: 'hive_2', value: 2, type: 'hive' },
    { label: 'oracle_1', value: 3, type: 'oracle' },
];
const formLayout: any = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

const FormSample: React.FC<IProps> = (props) => {
    const { parsedJson } = props;
    const formRef = useRef<FormInstance>(null);


    const renderFixedItem = (form, extraDataRef) => {
        return (
            <>
                <FormItem
                    name="sourceId"
                    label="数据来源"
                    rules={[
                        {
                            required: true,
                            message: '请选择数据来源！',
                        },
                    ]}
                >
                    <Select
                        onChange={(v) => {
                            const sourceType = sourceList.find(
                                (s) => s.value === v,
                            )?.type;
                            form.setFieldValue('sourceType', sourceType);
                        }}
                        placeholder="请选择数据来源"
                        options={sourceList}
                    />
                </FormItem>
                <FormItem name="sourceType" label="数据源类型" hidden>
                    <Input />
                </FormItem>
            </>
        );
    };

    return (
        <FormRenderer
            ref={formRef}
            {...formLayout}
            docsMap={docsMap}
            getWidgets={getWidgets}
            ruleMap={ruleMap}
            formServicePool={formServicePool}
            parsedJson={parsedJson}
            defaultExtraData={{
                isNotHiveTable: false,
            }}
            preserveFields={['sourceId', 'sourceType']}
            preserveFormItems={renderFixedItem}
            initialValues={props.initialValues}
        />
    );
};

export default FormSample;
