import React, { useState, useRef, useEffect, useContext } from 'react';
import { message } from 'antd';
import { editor } from 'monaco-editor';

import hiveSource from '@/components/formSample/jsonSample/hiveSource';
import oracleSource from '@/components/formSample/jsonSample/oracleSource';
import Editor from '@/components/editor';
import FormSample from '@/components/formSample';
import TitleWithToolbar from '@/components/titleWithToolbar';
import { downloadFile, copy2Clipboard } from '@/utils';
import { PlaygroundContext } from '..';
import './workbench.less'
import { localDB, LocalDBKey } from '@/utils/localDb';

const WorkBench: React.FC<any> = () => {
    const [parsedJson, setParsedJson] = useState([]);
    const [initialValues, setInitialValues] = useState();
    const [source, updateSource] = useState<{
        sourceId: number;
        sourceType: string;
    }>({ sourceId: undefined, sourceType: undefined });
    const configEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const valueEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const autoSaveTimer = useRef(null)
    const context = useContext(PlaygroundContext)

    useEffect(() => {
        const workbench = localDB.get(LocalDBKey.WorkBench);
        const content = workbench.find(w => w.name === context.workInProgress)?.content
        configEditorRef.current.setValue(content ?? '')
    }, [context.workInProgress])

    useEffect(() => {
        if(context.autoSave) {
            autoSaveTimer.current = setInterval(() => {
                localDB.autoSaveConfig(context.workInProgress, configEditorRef.current.getValue())
            }, 2000)
        }
        return () => {
            clearInterval(autoSaveTimer.current)
        }
    }, [context.autoSave, configEditorRef.current, context.workInProgress])

    useEffect(() => {
        const { sourceType } = source;
        if (!configEditorRef.current) return;

        if (sourceType === 'hive') {
            let values = {};
            setParsedJson([...hiveSource]);
            configEditorRef.current.setValue(
                JSON.stringify(hiveSource, null, 2),
            );
            hiveSource.forEach((item) => {
                if (item.fieldName) {
                    values[item.fieldName] = null;
                }
            });
            valueEditorRef.current.setValue(JSON.stringify(values, null, 2));
        } else if (sourceType === 'oracle') {
            let values = {};
            setParsedJson([...oracleSource]);
            configEditorRef.current.setValue(
                JSON.stringify(oracleSource, null, 2),
            );
            oracleSource.forEach((item) => {
                if (item.fieldName) {
                    values[item.fieldName] = null;
                }
            });
            valueEditorRef.current.setValue(JSON.stringify(values, null, 2));
        }
    }, [source.sourceType]);



    const parseEditorValue = (value: string) => {
        return new Promise<any>((resolve, reject) => {
            if(value.replace(/\s/g, '') === '') {
                resolve(null);
            }
            let parsedValue = [];
            try {
                parsedValue = JSON.parse(value);
            } catch (error) {
                console.error(error);
                message.error('json 解析失败！');
                reject(error);
            }
            resolve(parsedValue);
        });
    };

    const formatEditorContent = (
        ref: React.RefObject<editor.IStandaloneCodeEditor>,
    ) => {
        parseEditorValue(ref.current.getValue()).then((obj) => {
            ref.current.setValue(JSON.stringify(obj, null, 2));
            message.success('格式化成功！');
        });
    };

    const refreshForm = () => {
        const promises = [
            parseEditorValue(valueEditorRef.current.getValue()),
            parseEditorValue(configEditorRef.current.getValue()),
        ];
        Promise.all(promises).then(([initialValues, parsedJson]) => {
            setInitialValues(initialValues);
            setParsedJson(parsedJson ?? []);
        });
    };

    const refreshValueEditor = () => {
        const values = {};
        parseEditorValue(configEditorRef.current.getValue()).then(
            (parsedJson) => {
                parsedJson.forEach((item) => {
                    if (item.fieldName) {
                        values[item.fieldName] = null;
                    }
                });
                valueEditorRef.current.setValue(
                    JSON.stringify(values, null, 2),
                );
                message.success('刷新成功， 表单已重新渲染！');
            },
        );
    };

    const changeParsedJson = (sourceId, sourceType) => {
        updateSource({ sourceId, sourceType });
    };

    return (
        <>
            <div className="editor-container">
                <div className="editor-config-wrapper">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <TitleWithToolbar
                            onCopy={() => {
                                copy2Clipboard(
                                    configEditorRef.current.getValue(),
                                );
                            }}
                            onDownload={() => {
                                downloadFile(
                                    configEditorRef.current.getValue(),
                                );
                            }}
                            onFormat={() => {
                                formatEditorContent(configEditorRef);
                            }}
                        >
                            表单项配置
                        </TitleWithToolbar>
                        <div style={{ flex: '1 1 0%' }}>
                            <Editor
                                className="editor-config"
                                language="json"
                                style={{
                                    height: '99%.9999' /** 避免无法自动改变高度 */,
                                }}
                                ref={(r) =>
                                    (configEditorRef.current =
                                        r?.monacoInstance)
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="editor-value-wrapper">
                    <TitleWithToolbar
                        onReload={refreshValueEditor}
                        onFormat={() => {
                            formatEditorContent(valueEditorRef);
                        }}
                        onCopy={() => {
                            copy2Clipboard(valueEditorRef.current.getValue());
                        }}
                    >
                        表单初始值
                    </TitleWithToolbar>
                    <Editor
                        className="editor-value"
                        language="json"
                        ref={(r) =>
                            (valueEditorRef.current = r?.monacoInstance)
                        }
                        editorHeight={{
                            kind: 'dynamic',
                            maxHeight: '30vh',
                        }}
                    />
                </div>
            </div>
            <div className="form-wrapper">
                <TitleWithToolbar size="large" onReload={refreshForm}>
                    Form UI Preview
                </TitleWithToolbar>
                <FormSample
                    changeParseJson={changeParsedJson}
                    parsedJson={parsedJson}
                    initialValues={initialValues}
                />
            </div>
        </>
    );
};
export default WorkBench;
