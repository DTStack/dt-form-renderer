import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Alert } from 'antd';

import { editor } from 'monaco-editor';
import hiveSource from './jsonSample/hiveSource';
import oracleSource from './jsonSample/oracleSource';
import Editor from './editor';
import FormDemo from './formDemo';
import TitleWithReload from './titleWithReload';
import './styles/playground.less';
import './styles/ant-cover.css';

const PlayGround: React.FC<any> = () => {
    const [parsedJson, updateParsedJson] = useState([]);
    const [source, updateSource] = useState<{
        sourceId: number;
        sourceType: string;
    }>({ sourceId: undefined, sourceType: undefined });
    const configEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const valueEditorRef = useRef<editor.IStandaloneCodeEditor>(null);

    useEffect(() => {
        const { sourceType } = source;
        if (!configEditorRef.current) return;
        if (sourceType === 'hive') {
            updateParsedJson([...hiveSource]);
            configEditorRef.current.setValue(JSON.stringify(hiveSource, null, 2));
        } else if (sourceType === 'oracle') {
            updateParsedJson([...oracleSource]);
            configEditorRef.current.setValue(JSON.stringify(oracleSource, null, 2));
        }
    }, [source.sourceType, source.sourceId]);

    const refresh = () => {
        let parsedJson;
        try {
            parsedJson = JSON.parse(configEditorRef.current.getValue());
        } catch (error) {
            console.error(error);
            message.error('json 解析失败！');
        }
        updateParsedJson(parsedJson ?? []);
    };

    const changeParsedJson = (sourceId, sourceType) => {
        updateSource({ sourceId, sourceType });
    };

    return (
        <div className="playground">
            <div className="playground-header">
                <Alert
                    message="demo 已经内置了 hive 和 oracle 两种数据源作为来源时的配置，选择数据源，左侧编辑器就会自动出现对应的配置，编辑配置，并点击 refresh 按钮，表单会根据编辑器内容重新渲染！"
                    type="info"
                    showIcon
                />
            </div>
            <div className="playground-content">
                <div className="editor-container">
                    <div className='editor-config-wrapper'>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                            <TitleWithReload
                            >表单项配置</TitleWithReload>
                            <div style={{ flex: '1 1 0%'}}>
                                <Editor
                                    className='editor-config'
                                    language="json"
                                    style={{ height: '99%.9999' /** 避免无法自动改变高度 */}}
                                    ref={(r) => (configEditorRef.current = r?.monacoInstance)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='editor-value-wrapper'>
                        <TitleWithReload>表单初始值</TitleWithReload>
                        <Editor
                            className='editor-value'
                            language="json"
                            ref={(r) => (valueEditorRef.current = r?.monacoInstance)}
                            editorHeight={{ kind: "dynamic", maxHeight: '30vh' }}
                        />
                    </div>
                </div>
                <div className="form-wrapper">
                    <TitleWithReload 
                        size='large'
                        onReload={refresh}
                    >Form UI Preview</TitleWithReload>
                    <FormDemo
                        changeParseJson={changeParsedJson}
                        parsedJson={parsedJson}
                    />
                </div>
            </div>
        </div>
    );
};
export default PlayGround;
