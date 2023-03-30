import React from "react";
import Tooltip from "antd/es/tooltip";
import { ReloadOutlined } from '@ant-design/icons';
import './index.less'

interface TitleWithReloadProps {
    onReload?: () => any;
    size?: 'default'|'large'|'small'
}

const TitleWithReload: React.FC<TitleWithReloadProps> = props => {
    const className = props.size ? `reload-title-${props.size}`: ''
    return(
        <p className={"reload-title " + className}>
            <span className="reload-title-text">{props.children}</span>
            <Tooltip title="刷新">
                <ReloadOutlined onClick={() => props.onReload?.()}/>
            </Tooltip>
        </p>
    )
}

export default TitleWithReload