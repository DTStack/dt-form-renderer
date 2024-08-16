import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { editor } from 'monaco-editor';
import { JsonConfigType } from '@dt-form-renderer/core';
import Editor, { setEditorValue } from '@/components/editor';
import FormSample from '@/components/formSample';
import TitleWithToolbar from '@/components/titleWithToolbar';
import ErrorBoundary from '@/components/errorBoundary';
import { downloadFile, copy2Clipboard, debounceFunctionWrap } from '@/utils';
import { updateFile } from '@/store/reducers/workbenchSlice';
import { RootState, useAppDispatch } from '@/store';
import './workbench.less';

interface workbenchProps {}

const WorkBench: React.FC<workbenchProps> = () => {
    const [parsedJson, setParsedJson] = useState({} as JsonConfigType);
    const [initialValues, setInitialValues] = useState();
    const configEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const valueEditorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const {
        workbench: { workInProgress, files },
    } = useSelector<RootState, RootState>((state) => state);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const file = files?.find((w) => w.name === workInProgress);
        setEditorValue(configEditorRef.current, file?.configContent ?? '');
        setEditorValue(valueEditorRef.current, file?.valuesContent ?? '');
        if (file?.valuesContent) {
            refreshForm();
        }
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
            })
        );
    });

    const parseEditorValue = (value: string, required = true) => {
        return new Promise<any>((resolve, reject) => {
            if (value.replace(/\s/g, '') === '') {
                if (required) {
                    message.error('json 配置不能为空！');
                    reject();
                    return;
                } else {
                    resolve({});
                    return;
                }
            }
            let parsedValue = {};
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
        ref: React.RefObject<editor.IStandaloneCodeEditor>
    ) => {
        return parseEditorValue(ref.current.getValue(), false).then((obj) => {
            setEditorValue(ref.current, JSON.stringify(obj, null, 4));
            message.success('格式化成功！');
        });
    };

    const refreshForm = () => {
        const promises = [
            parseEditorValue(
                valueEditorRef.current.getModel().getValue(),
                false
            ),
            parseEditorValue(
                configEditorRef.current.getModel().getValue(),
                true
            ),
        ];
        return Promise.all(promises)
            .then(([initialValues, parsedJson]) => {
                setInitialValues(initialValues);
                setParsedJson(parsedJson ?? {});
            })
            .catch((e) => {});
    };

    const refreshValueEditor = (config?: string) => {
        const values = {};
        return parseEditorValue(
            config ?? configEditorRef.current.getValue()
        ).then((parsedJson: JsonConfigType) => {
            parsedJson.fieldList.forEach((item) => {
                if (item.fieldName) {
                    values[item.fieldName] = null;
                }
            });
            setEditorValue(
                valueEditorRef.current,
                JSON.stringify(values, null, 4)
            );
        });
    };

    const onImportTemplate = (config: string) => {
        setEditorValue(configEditorRef.current, config);
        setEditorValue(valueEditorRef.current, JSON.stringify({}, null, 4));
        refreshForm();
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
                                    configEditorRef.current.getValue()
                                );
                            }}
                            onDownload={() => {
                                downloadFile(
                                    configEditorRef.current.getValue(),
                                    workInProgress
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
                <div className="form-content">
                    <ErrorBoundary onRefresh={refreshForm}>
                        <FormSample
                            parsedJson={parsedJson}
                            initialValues={initialValues}
                        />
                    </ErrorBoundary>
                </div>
            </div>
        </>
    );
};
export default WorkBench;
