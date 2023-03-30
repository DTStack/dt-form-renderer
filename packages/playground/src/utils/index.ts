import { message } from 'antd';

/**
 * @description 下载文本内容
 * @param text 文件文本内容
 * @param ext 文件扩展名
 */
export function downloadFile(text: string, ext: string = 'json') {
    const eleLink = document.createElement('a');
    eleLink.download = `json_config_${Date.now()}.${ext}`;
    eleLink.style.display = 'none';
    var blob = new Blob([text]);
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
