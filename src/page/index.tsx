import React, { useState } from 'react';
import FormRender from '../components/formRenderer';
import hiveSource from './jsonSample/hiveSource';
import formServicePool from './formServicePool';
import ruleMap from './formRuleMap';

const Page: React.FC<any> = () => {
    const [parsedJson, updateParsedJson] = useState(hiveSource)

    return(
        <div className='page'>
            <FormRender
                ruleMap={ruleMap}
                formServicePool={formServicePool}
                className='form-render'
                parsedJson={parsedJson}
                defaultExtraData={{
                    isNotHiveTable: true
                }}
            />
        </div>
    )
}
export default Page