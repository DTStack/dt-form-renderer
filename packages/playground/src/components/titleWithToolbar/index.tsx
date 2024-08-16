import React from 'react';
import { Select, Tooltip } from 'antd';
import {
    ReloadOutlined,
    FormatPainterOutlined,
    CopyOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import loginFormMeta from '../formSample/jsonSample/login';
import dataSyncFormMeta from '../formSample/jsonSample/dataSync';
import './index.less';
import type { DefaultOptionType } from 'antd/lib/select';

export const templateOptions: DefaultOptionType[] = [
    {
        label: '登录表单',
        value: JSON.stringify(loginFormMeta, null, 4),
    },
    {
        label: '数据同步',
        value: JSON.stringify(dataSyncFormMeta, null, 4),
    },
];

interface TitleWithToolbarProps {
    onReload?: () => any;
    onFormat?: () => any;
    onCopy?: () => any;
    onDownload?: () => any;
    onImportTemplate?: (config: string) => any;
    size?: 'default' | 'large' | 'small';
}

const TitleWithToolbar: React.FC<TitleWithToolbarProps> = (props) => {
    const className = props.size ? `toolbar-title-${props.size}` : '';
    return (
        <p className={'toolbar-title ' + className}>
            <p>
                <span className="toolbar-title-title">{props.children}</span>
                {props.onImportTemplate ? (
                    <Select
                        size="small"
                        style={{ width: 150, marginLeft: 12 }}
                        placeholder="选择模板以导入"
                        value={null}
                        options={templateOptions}
                        onSelect={(value) => {
                            props.onImportTemplate(value);
                        }}
                    />
                ) : null}
            </p>
            <span className="toolbar-title-toolbar">
                {props.onDownload ? (
                    <span onClick={() => props.onDownload?.()}>
                        <Tooltip title="下载">
                            <DownloadOutlined />
                        </Tooltip>
                    </span>
                ) : null}
                {props.onCopy ? (
                    <span onClick={() => props.onCopy?.()}>
                        <Tooltip title="复制">
                            <CopyOutlined />
                        </Tooltip>
                    </span>
                ) : null}
                {props.onFormat ? (
                    <span onClick={() => props.onFormat?.()}>
                        <Tooltip title="格式化">
                            <FormatPainterOutlined />
                        </Tooltip>
                    </span>
                ) : null}
                {props.onReload ? (
                    <span onClick={() => props.onReload?.()}>
                        <Tooltip title="刷新">
                            <ReloadOutlined />
                        </Tooltip>
                    </span>
                ) : null}
            </span>
        </p>
    );
};

export default TitleWithToolbar;
