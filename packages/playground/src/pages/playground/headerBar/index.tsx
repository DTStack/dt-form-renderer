import React, { useContext } from "react";
import { Checkbox } from "antd";
import { PlaygroundContext } from "..";
import './headerbar.less'
import { LocalDBKey } from "@/utils/localDb";

interface HeaderBarProps {

}

const HeaderBar: React.FC<HeaderBarProps> = (props) => {
    const {autoSave, updateContext} = useContext(PlaygroundContext)
    return(
        <div className="playground-header-bar">
            <Checkbox
                checked={autoSave}
                onChange={(e) => {
                    updateContext({ [LocalDBKey.AutoSave]: e.target.checked })
                }}
            >
                自动保存
            </Checkbox>
        </div>
    )
}

export default HeaderBar;
