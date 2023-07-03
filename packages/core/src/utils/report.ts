export function warning(msg: string, part?: string) {
    if (process.env.NODE_ENV !== 'production') {
        if (typeof console !== 'undefined' && console.error) {
            console.error(`[FormRender: ${part}] ${msg}`);
        }
    }
}
