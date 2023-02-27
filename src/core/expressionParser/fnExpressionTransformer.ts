import { IExtraDataRef } from "../extraDataContext";

export interface IScope {
    formData: any;
    extraDataRef: IExtraDataRef;
}

class FnExpressionTransformer {
    private sandboxProxiesMap: WeakMap<IScope, InstanceType<typeof Proxy>> = new WeakMap();

    private createProxy(scopeObj: IScope) {
        /** 存储创建的 proxy 避免重复创建 */
        if(this.sandboxProxiesMap.has(scopeObj)) {
            return this.sandboxProxiesMap.get(scopeObj)
        }
        const scope = {
            extraData: scopeObj.extraDataRef,
            formData: scopeObj.formData
        }
        const proxy = new Proxy(scope, {
            has() {
                return true
            },
            get(target, prop) {
                if (prop === Symbol.unscopables) return undefined
                if (prop === 'extraData') {
                    return target[prop]["current"]
                }
                return target[prop]
            }
        })
        this.sandboxProxiesMap.set(scopeObj, proxy);
        return proxy
    }

    generateFn = (code: string) => {
        return (scope: IScope) => {
            const proxy = this.createProxy(scope)
            const fnBody = `with(scope) {  return ${ code } }`
            const fn = new Function('scope', fnBody)
            return fn(proxy)
        }
    }
}

export default FnExpressionTransformer


