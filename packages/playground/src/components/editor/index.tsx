import React from 'react';
import { editor } from 'monaco-editor';
import './autoComplete';
import './index.less'

export type MonacoEditorHeight =
	| { kind: "fill" }
	| {
		kind: "dynamic";
		maxHeight?: number|string;
	  };

interface EditorProps {
    value?: string;
    onChange?: (value: string) => void;
    language?: string;
    style?: React.CSSProperties;
    className?: string;
    editorHeight?: MonacoEditorHeight
};

const initialState = {
    contentHeight: undefined as number,
}

type EditorState = typeof initialState;

class Editor extends React.Component<EditorProps, EditorState> {
    state=initialState
    private _container = null;
    monacoInstance: editor.IStandaloneCodeEditor = null;

    private readonly resizeObserver = new ResizeObserver(() => {
		if (this.monacoInstance) {
			this.monacoInstance.layout();
		}
	});

    componentDidMount() {
        this.initEditor();
    }

    componentDidUpdate(
        prevProps: Readonly<any>,
    ): void {
        if (prevProps.value !== this.props.value) {
            const pos = this.monacoInstance.getPosition();
            this.monacoInstance.setValue(this.props.value);
            this.monacoInstance.setPosition(pos);
        }
    }

    componentWillUnmount(): void {
        this.monacoInstance.dispose()
        this.resizeObserver.disconnect()
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
        this.monacoInstance.onDidChangeModelContent((event: any) => {
            const { onChange } = this.props;
            const newValue = this.monacoInstance.getValue();
            if (onChange) onChange(newValue);
        });
        this.monacoInstance.onDidContentSizeChange((e) => {
			this.setState({ contentHeight: e.contentHeight });
		});
    };

    render() {
        const { style={}, className, editorHeight } = this.props
        const { contentHeight } = this.state;
        const editorStyle = {
            ...style
        }
        if(!editorStyle.height) {
            if(editorHeight?.kind === 'dynamic') {
                editorStyle.maxHeight = editorStyle.maxHeight ?? editorHeight?.maxHeight ?? 300;
                editorStyle.minHeight = 100
                editorStyle.height = contentHeight
            } else {
                editorStyle.height = '100%'
            }
        }

        return (
            <div
                ref={(r) => (this._container = r)}
                style={editorStyle}
                className={`dataSync-monaco-editor ${className ?? ''}`}
            />
        );
    }
}

export default Editor;
