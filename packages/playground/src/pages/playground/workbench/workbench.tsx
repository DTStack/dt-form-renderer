import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { editor } from 'monaco-editor';
import Editor from '@/components/editor';
import FormSample from '@/components/formSample';
import TitleWithToolbar from '@/components/titleWithToolbar';
import { downloadFile, copy2Clipboard, debounceFunctionWrap } from '@/utils';
import { updateFile } from '@/store/reducers/workbenchSlice';
import { RootState, useAppDispatch } from '@/store';
import './workbench.less';

interface workbenchProps {}

const WorkBench: React.FC<workbenchProps> = () => {
    const [parsedJson, setParsedJson] = useState([]);
    const [initialValues, setInitialValues] = useState();
    const configEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const valueEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const {
        workbench: { workInProgress, files },
    } = useSelector<RootState, RootState>((state) => state);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const file = files?.find((w) => w.name === workInProgress);
        configEditorRef.current.setValue(file?.configContent ?? '');
        valueEditorRef.current.setValue(file?.valuesContent ?? '');
    }, [workInProgress]);

    const saveCurrentPage = debounceFunctionWrap(() => {
        const content = configEditorRef.current.getValue();
        const initialValuesContent = valueEditorRef.current.getValue();
        dispatch(
            updateFile({
                fileName: workInProgress,
                fileMeta: {
                    configContent: content,
                    valuesContent: initialValuesContent,
                },
            }),
        );
    });

    const parseEditorValue = (value: string) => {
        return new Promise<any>((resolve, reject) => {
            if (value.replace(/\s/g, '') === '') {
                reject(null);
                return;
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
        return parseEditorValue(ref.current.getValue()).then((obj) => {
            ref.current.setValue(JSON.stringify(obj, null, 2));
            message.success('格式化成功！');
        });
    };

    const refreshForm = () => {
        const promises = [
            parseEditorValue(valueEditorRef.current.getValue()),
            parseEditorValue(configEditorRef.current.getValue()),
        ];
        return Promise.all(promises).then(([initialValues, parsedJson]) => {
            setInitialValues(initialValues);
            setParsedJson(parsedJson ?? []);
        });
    };

    const refreshValueEditor = (config?: string) => {
        const values = {};
        return parseEditorValue(
            config ?? configEditorRef.current.getValue(),
        ).then((parsedJson) => {
            parsedJson.forEach((item) => {
                if (item.fieldName) {
                    values[item.fieldName] = null;
                }
            });
            valueEditorRef.current.setValue(JSON.stringify(values, null, 2));
        });
    };

    const onImportTemplate = (config: string) => {
        configEditorRef.current.setValue(config);
        refreshValueEditor(config).then(() => {
            refreshForm();
        });
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
                                    workInProgress,
                                );
                            }}
                            onFormat={() => {
                                formatEditorContent(configEditorRef);
                            }}
                            onImportTemplate={onImportTemplate}
                        >
                            表单项配置
                        </TitleWithToolbar>
                        <div style={{ flex: '1 1 0%' }}>
                            <Editor
                                onChange={saveCurrentPage}
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
                        onChange={saveCurrentPage}
                        editorHeight={{
                            kind: 'dynamic',
                            maxHeight: '30vh',
                        }}
                    />
                </div>
            </div>
            <div className="form-wrapper">
                <TitleWithToolbar size="large" onReload={refreshForm}>
                    表单 UI 预览
                </TitleWithToolbar>
                <FormSample
                    parsedJson={parsedJson}
                    initialValues={initialValues}
                />
            </div>
        </>
    );
};
export default WorkBench;
