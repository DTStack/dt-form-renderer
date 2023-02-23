import React, { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import { editor } from 'monaco-editor'
import hiveSource from './jsonSample/hiveSource';
import oracleSource from './jsonSample/oracleSource';
import JsonEditor from './editor';
import FormDemo from './formDemo'

const Page: React.FC<any> = () => {
    const [parsedJson, updateParsedJson] = useState([]);
    const [ source, updateSource ] = useState<{ sourceId: number, sourceType: string }>({sourceId: undefined, sourceType: undefined})
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null)

    useEffect(() => {
        const { sourceType } = source
        if(sourceType === 'hive') {
            updateParsedJson([...hiveSource])
            editorRef.current.setValue(JSON.stringify(hiveSource, null, 2))
        } else if (sourceType === 'oracle') {
            updateParsedJson([...oracleSource])
            editorRef.current.setValue(JSON.stringify(oracleSource, null, 2))
        }

    }, [source.sourceType, source.sourceId])


    const refresh = () => {
        let parsedJson
        try {
            parsedJson = JSON.parse(editorRef.current.getValue())
        } catch (error) {
            console.error(error) 
            message.error('json 解析失败！')
        }
        updateParsedJson(parsedJson ?? [])
    }

    const changeParsedJson = (sourceId, sourceType) => {
        updateSource({ sourceId, sourceType })
    }

    return(
        <div className='page'>
            <p className='page-header'>
                <Button type='primary' onClick={refresh}>refresh</Button>
            </p>
            <div className='page-container'>
                <div className='editor-wrapper'>
                    <JsonEditor
                        ref={(r) => editorRef.current = r?._monacoInstance}
                    />
                </div>
                <div className='form-wrapper'>
                    <FormDemo
                        changeParseJson={changeParsedJson}
                        parsedJson={parsedJson}
                    />
                </div>
            </div>
        </div>
    )
}
export default Page