export function warning(msg: string, part?: string) {
    if (typeof console !== 'undefined' && console.error) {
        console.error(`[FormRender: ${part}] ${msg}`);
    }
}
