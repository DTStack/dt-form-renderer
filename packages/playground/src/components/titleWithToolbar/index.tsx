import React from 'react';
import Tooltip from 'antd/es/tooltip';
import {
    ReloadOutlined,
    FormatPainterOutlined,
    CopyOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import './index.less';

interface TitleWithToolbarProps {
    onReload?: () => any;
    onFormat?: () => any;
    onCopy?: () => any;
    onDownload?: () => any;
    size?: 'default' | 'large' | 'small';

}

const TitleWithToolbar: React.FC<TitleWithToolbarProps> = (props) => {
    const className = props.size ? `toolbar-title-${props.size}` : '';
    return (
        <p className={'toolbar-title ' + className}>
            <span className="toolbar-title-title">{props.children}</span>
            <span className="toolbar-title-toolbar">
        
                {props.onDownload ? (
                    <Tooltip title="下载">
                        <DownloadOutlined onClick={() => props.onDownload?.()} />
                    </Tooltip>
                ) : null}
                {props.onCopy ? (
                    <Tooltip title="复制">
                        <CopyOutlined
                            onClick={() => props.onCopy?.()}
                        />
                    </Tooltip>
                ) : null}
                {props.onFormat ? (
                    <Tooltip title="格式化">
                        <FormatPainterOutlined
                            onClick={() => props.onFormat?.()}
                        />
                    </Tooltip>
                ) : null}
                {props.onReload ? (
                    <Tooltip title="刷新">
                        <ReloadOutlined onClick={() => props.onReload?.()} />
                    </Tooltip>
                ) : null}
            </span>
        </p>
    );
};

export default TitleWithToolbar;
