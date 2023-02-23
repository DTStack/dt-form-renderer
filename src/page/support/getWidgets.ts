import {
    Select,
} from 'antd'

import type { GetWidgets } from "../../core"

const getWidgets: GetWidgets = (widget: string) => {
    const name = widget.toLowerCase();
    switch (name) {
        case 'select': 
            return Select
        default:
            return null
    }
}

export default getWidgets;