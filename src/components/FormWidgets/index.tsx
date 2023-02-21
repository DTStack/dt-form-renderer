import * as Antd from 'antd'

export default function getWidgets (name) {
    if(Antd[name]) {
        return Antd[name]
    }
    return null;
}