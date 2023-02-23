import React, { useRef } from 'react';
import { Form, Select, Input } from 'antd';
import FormRenderer from '../core/components/formRenderer';
import formServicePool from './support/formServicePool';
import ruleMap from './support/formRuleMap';
import getWidgets from './support/getWidgets';
import { FormInstance } from 'antd/es/form/Form';
import docsMap from './support/doc'
import { IExtraDataRef } from '../core/extraDataContext';

const FormItem = Form.Item

interface IProps {
    parsedJson: any[],
    changeParseJson: ( sourceId, sourceType ) => void
}

const sourceList = [
    {label: 'hive_1', value: 1, type: "hive"}, 
    {label: 'hive_2', value: 2, type: "hive"}, 
    {label: 'oracle_1', value: 3, type: "oracle"},  
]
const formLayout: any = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

const FormDemo: React.FC<IProps> = (props) => {
    const { parsedJson, changeParseJson } = props
    const formRef = useRef<FormInstance>(null)

    const renderFixedItem = (form: FormInstance, extraDataRef: IExtraDataRef) => {
        return (
            <>
                <FormItem
                    name="sourceId"
                    label="数据来源"
                    rules={[
                        {
                            required: true,
                            message: '请选择数据来源！'
                        }
                   
                    ]}
                >
                    <Select
                        onChange={(v) => {
                            const sourceType = sourceList.find(s => s.value === v)?.type
                            form.setFieldValue('sourceType', sourceType)
                            changeParseJson(v, sourceType)
                        }}
                        placeholder="请选择数据来源"
                        options={sourceList}
                    />
                </FormItem>
                <FormItem
                    name="sourceType"
                    label="数据源类型"
                    hidden
                >
                    <Input/>
                </FormItem>
            </>
        )
    }

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
                isNotHiveTable: false
            }}
            preserveFields={['sourceId', 'sourceType']}
            preserveFormItems={renderFixedItem}
            style={{ width: 600}}
        />
    )
}

export default FormDemo