import React from "react";
import { editor } from 'monaco-editor';

interface IProps {
    value: string;
    onChange: (value: string) => void;
}

class JsonEditor extends React.Component<IProps> {
    _container = null
    _monacoInstance: editor.IStandaloneCodeEditor = null

    componentDidMount() {
        this.initEditor()
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any): void {
        if(prevProps.value !== this.props.value) {
            this._monacoInstance.setValue(this.props.value);
        }
    }

    initEditor = () => {
        const value = this.props.value;
        this._monacoInstance = editor.create(this._container, {
            readOnly: false,
            contextmenu: true,
            autoIndent: 'keep',
            automaticLayout: true,
            showFoldingControls: 'always',
            folding: true,
            foldingStrategy: 'auto',
            suggestFontSize: 13,
            fontSize: 13,
            fixedOverflowWidgets: true,
            renderControlCharacters: true,
            language: 'flink',
            value,
        })
        this.initEditorEvent()
    }

    initEditorEvent = () => {
        this._monacoInstance.onDidChangeModelContent((event: any) => {
            const { onChange } = this.props;
            const newValue = this._monacoInstance.getValue();
            // 考虑到语法解析比较耗时，所以把它放到一个带有调用延迟的函数中，并且提供一个可供订阅的onSyntaxChange函数
                onChange(newValue);
            }
        )
    }

    render(): React.ReactNode {
        return <div 
            ref={(r) => this._container = r } 
            style={{width: '100%', height: '100%'}}
        />
    }
}

export default JsonEditor