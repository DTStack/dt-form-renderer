import { message } from 'antd';

/**
 * @description 下载文本内容
 * @param content 文件文本内容
 * @param ext 文件扩展名
 */
export function downloadFile(
    content: string,
    name: string,
    ext: string = 'json',
) {
    const eleLink = document.createElement('a');
    eleLink.download = `${name}_${Date.now()}.${ext}`;
    eleLink.style.display = 'none';
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}

/**
 * @description 复制到剪切板
 */
export function copy2Clipboard(text: string) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            message.success('复制成功！');
        })
        .catch((err) => {
            message.error('复制失败！');
        });
}

/**
 * 该函数delayTime时间内顶多执行一次func（最后一次），如果freshTime时间内没有执行，则强制执行一次。
 * @param {function} func
 */
export function debounceFunctionWrap(func?: any) {
    /**
     * 最小执行间隔，每隔一段时间强制执行一次函数
     * 这里不能太小，因为太小会导致大的解析任务没执行完阻塞。
     */
    let freshTime = 1000;
    /**
     * 函数延迟时间
     */
    let delayTime = 200;

    let outTime: any;
    let _timeClock: any;
    return function () {
        const arg: any = arguments;
        _timeClock && clearTimeout(_timeClock);
        // 这边设置在一定时间内，必须执行一次函数
        if (outTime) {
            let now: any = new Date();
            if (now - outTime > freshTime) {
                func(...arg);
            }
        } else {
            outTime = new Date();
        }
        _timeClock = setTimeout(() => {
            outTime = null;
            func(...arg);
        }, delayTime);
    };
}
