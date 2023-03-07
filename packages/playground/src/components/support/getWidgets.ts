import {
    Select,
} from 'antd'
import Editor from '../editor'

import type { GetWidgets } from "@datasync-form-renderer/core"

const getWidgets: GetWidgets = (widget: string) => {
    const name = widget.toLowerCase();
    switch (name) {
        case 'select': 
            return Select
        case 'sqleditor':
            return Editor
        default:
            return null
    }
}

export default getWidgets;