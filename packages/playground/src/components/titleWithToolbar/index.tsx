import React from 'react';
import { Select, Tooltip } from 'antd';
import {
    ReloadOutlined,
    FormatPainterOutlined,
    CopyOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import hiveSource from '../formSample/jsonSample/hiveSource';
import oracleSource from '../formSample/jsonSample/oracleSource';
import './index.less';
import type { DefaultOptionType } from 'antd/lib/select';

const options: DefaultOptionType[] = [
    {
        label: 'hive source',
        value: JSON.stringify(hiveSource, null, 2)
    },
    {
        label: 'oracle source',
        value: JSON.stringify(oracleSource, null, 2)
    },
]

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
                {props.onImportTemplate
                    ? (<Select
                            size="small"
                            style={{ width: 150, marginLeft: 12 }}
                            placeholder="选择模板以导入"
                            value={null}
                            options={options}
                            onSelect={(value) => {props.onImportTemplate(value) }}
                        />)
                    : null}
            </p>
            <span className="toolbar-title-toolbar">
                {props.onDownload ? (
                    <Tooltip title="下载">
                        <DownloadOutlined
                            onClick={() => props.onDownload?.()}
                        />
                    </Tooltip>
                ) : null}
                {props.onCopy ? (
                    <Tooltip title="复制">
                        <CopyOutlined onClick={() => props.onCopy?.()} />
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
