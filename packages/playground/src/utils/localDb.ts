
const isJSONStr = (str: string) => {
    let flag = false;
     try {
         JSON.parse(str);
         flag = true
     } catch (error) {
         
     }
     return flag
 };

export const DefaultWip = 'untitled'

export enum LocalDBKey {
    AutoSave = 'autoSave',
    WorkBench = 'workbench',
    WIP = 'workInProgress',
}
/**
 * @description LocalStorage utils
 */
export const localDB = {
    /**
     * 按 key 存贮数据 value 到 localStorage
     * @param {String} key   存贮数据的唯一标识
     * @param {String, Object} value 所要存贮的数据
     */
    set(key: LocalDBKey, value: any) {
        const val = typeof value === 'object' ? JSON.stringify(value) : value;
        window.localStorage[key] = val;
    },

    autoSaveConfig(wip: string, content: string, isCreate?: boolean) {
        const workbench: any[] = localDB.get(LocalDBKey.WorkBench)??[];
        const index = workbench.findIndex(w => w.name === DefaultWip)
        if(wip === DefaultWip && index === -1) {
            workbench.unshift({
                name: DefaultWip,
                content: content
            })
        } else {
            workbench[index] = {
                name: wip,
                content,
            }
        }
        localDB.set(LocalDBKey.WorkBench, workbench)
    },

    /**
     * 通过 key 从 localStorage 获取数据
     * @param  {String} key  获取数据的唯一标识
     * @return {String, Object}  返回空、字符串或者对象
     */
    get(key: LocalDBKey) {
        const str = window.localStorage[key];
        return isJSONStr(str) ? JSON.parse(str) : str;
    },

    /**
     * 通过 key 从 localStorage 删除数据
     * @param  {String} key  删除数据的唯一标识
     */
    remove(key: LocalDBKey) {
        delete window.localStorage[key];
    },

    /**
     * 清空 localStorage
     * @return 无返回 NULL
     */
    clear() {
        window.localStorage.clear();
    },
};