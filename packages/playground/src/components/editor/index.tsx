import React from 'react';
import { editor, IDisposable } from 'monaco-editor';
import './autoComplete';
import './index.less';

export type MonacoEditorHeight =
    | { kind: 'fill' }
    | {
          kind: 'dynamic';
          maxHeight?: number | string;
      };

interface EditorProps {
    value?: string;
    onChange?: (value: string, event: editor.IModelContentChangedEvent) => void;
    language?: string;
    style?: React.CSSProperties;
    className?: string;
    editorHeight?: MonacoEditorHeight;
}

const initialState = {
    contentHeight: undefined as number,
};

type EditorState = typeof initialState;

class Editor extends React.Component<EditorProps, EditorState> {
    state = initialState;

    private _container = null;
    monacoInstance: editor.IStandaloneCodeEditor = null;
    private __prevent_onChange = false;
    private _changeSubscription: IDisposable;
    private _resizeSubscription: IDisposable;
    private readonly resizeObserver = new ResizeObserver(() => {
        if (this.monacoInstance) {
            this.monacoInstance.layout();
        }
    });

    componentDidMount() {
        this.initEditor();
    }

    componentDidUpdate(prevProps: Readonly<any>): void {
        if (prevProps.value !== this.props.value) {
            this.__prevent_onChange = true;
            this.monacoInstance.pushUndoStop();
            this.monacoInstance.getModel().pushEditOperations(
                [],
                [
                    {
                        range: this.monacoInstance
                            .getModel()
                            .getFullModelRange(),
                        text: this.props.value,
                    },
                ],
                () => null
            );
            this.monacoInstance.pushUndoStop();
            this.__prevent_onChange = false;
        }
    }

    componentWillUnmount(): void {
        this.monacoInstance.dispose();
        this.resizeObserver.disconnect();
        this._changeSubscription.dispose();
        this._resizeSubscription.dispose();
    }

    initEditor = () => {
        const value = this.props.value;
        if (!this.monacoInstance) {
            this.monacoInstance = editor.create(this._container, {
                readOnly: false,
                contextmenu: true,
                autoIndent: 'keep',
                automaticLayout: false,
                showFoldingControls: 'always',
                folding: true,
                foldingStrategy: 'auto',
                suggestFontSize: 13,
                fontSize: 13,
                fixedOverflowWidgets: true,
                scrollBeyondLastLine: false,
                renderControlCharacters: true,
                language: this.props.language ?? 'sql',
                value,
                minimap: { enabled: false },
            });
            this.initEditorEvent();
            this.resizeObserver.observe(this._container);
        }
    };

    initEditorEvent = () => {
        this._changeSubscription = this.monacoInstance.onDidChangeModelContent(
            (event: any) => {
                const { onChange } = this.props;
                const newValue = this.monacoInstance.getValue();
                if (!this.__prevent_onChange && onChange) {
                    onChange(newValue, event);
                }
            }
        );

        this._resizeSubscription = this.monacoInstance.onDidContentSizeChange(
            (e) => {
                this.setState({ contentHeight: e.contentHeight });
            }
        );
    };

    render() {
        const { style = {}, className, editorHeight } = this.props;
        const { contentHeight } = this.state;
        const editorStyle = {
            ...style,
        };
        if (!editorStyle.height) {
            if (editorHeight?.kind === 'dynamic') {
                editorStyle.maxHeight =
                    editorStyle.maxHeight ?? editorHeight?.maxHeight ?? 300;
                editorStyle.minHeight = 100;
                editorStyle.height = contentHeight;
            } else {
                editorStyle.height = '100%';
            }
        }

        return (
            <div
                ref={(r) => (this._container = r)}
                style={editorStyle}
                className={`dt-monaco-editor ${className ?? ''}`}
            />
        );
    }
}

export default Editor;
