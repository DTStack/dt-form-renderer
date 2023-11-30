import React, { useLayoutEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd/es/form/Form';
import FormRenderer, { JsonConfigType } from '@dt-form-renderer/core';
import formServicePool from './support/formServicePool';
import ruleMap from './support/formRuleMap';
import getWidgets from './support/getWidgets';
import docsMap from './support/doc';

interface IProps {
    parsedJson: JsonConfigType;
    initialValues: any;
}

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

    const formRef = useRef<FormInstance>(null);

    useLayoutEffect(() => {
        setJsonConfig(parsedJson);
    }, [parsedJson]);

    return (
        <FormRenderer
            ref={formRef}
            {...formLayout}
            docsMap={docsMap}
            rowProps={{ gutter: [16, 0] }}
            getWidgets={getWidgets}
            ruleMap={ruleMap}
            formServicePool={formServicePool}
            jsonConfig={jsonConfig}
            defaultExtraData={extraData}
            initialValues={props.initialValues}
            onValuesChange={(...args) => console.log(args)}
        />
    );
};

export default FormSample;
