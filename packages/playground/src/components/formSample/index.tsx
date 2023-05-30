import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { BaseOptionType } from 'antd/es/select';
import FormRenderer, { JsonConfigType } from '@dt-form-renderer/core';
import formServicePool from './support/formServicePool';
import ruleMap from './support/formRuleMap';
import getWidgets from './support/getWidgets';
import docsMap from './support/doc';
import { getSourceListViaType, getSourceTypeList } from './mockApi/index';
import {
    DataSourceType,
    DataSourceItem,
} from './mockApi/mockData/streamSource';

const FormItem = Form.Item;

interface IProps {
    parsedJson: JsonConfigType;
    initialValues: any;
}

const sourceTypeList = [{ label: 'mysql', value: 'mysql' }];

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

const defaultExtraData = {
    flinkVersion: '1.12',
    dataSourceList: [],
};

const FormSample: React.FC<IProps> = (props) => {
    const { parsedJson } = props;
    const [jsonConfig, setJsonConfig] = useState<JsonConfigType>(null);
    const [extraData, setExtraData] = useState<any>(defaultExtraData);
    const [sourceTypeList, updateSourceTypeList] = useState<DataSourceType[]>(
        []
    );
    const formRef = useRef<FormInstance>(null);

    useEffect(() => {
        getSourceTypeList().then((res) => {
            updateSourceTypeList(res);
        });
    }, []);

    useLayoutEffect(() => {
        setJsonConfig(parsedJson);
    }, [parsedJson]);

    const sourceTypeOptions = useMemo<BaseOptionType[]>(() => {
        return sourceTypeList.map((item) => ({
            label: item.name,
            value: item.type,
        }));
    }, [sourceTypeList]);

    const onChangeSource = (form, sourceType) => {
        getSourceListViaType(sourceType).then((res) => {
            setExtraData({
                ...extraData,
                dataSourceList: res.map((item) => ({
                    label: item.name,
                    value: item.id,
                })),
            });
        });
    };

    const renderFixedItem = (form, extraDataRef) => {
        return (
            <FormItem
                name="type"
                label="数据源类型"
                rules={[
                    {
                        required: true,
                        message: '请选择数据源类型!',
                    },
                ]}
            >
                <Select
                    onChange={(v) => {
                        onChangeSource(form, v);
                    }}
                    placeholder="请选择数据源类型"
                    options={sourceTypeOptions}
                />
            </FormItem>
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
            jsonConfig={jsonConfig}
            defaultExtraData={extraData}
            preserveFields={['sourceType']}
            header={renderFixedItem}
            initialValues={props.initialValues}
            onValuesChange={(...args) => console.log(args)}
        />
    );
};

export default FormSample;
