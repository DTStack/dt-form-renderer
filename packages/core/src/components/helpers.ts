export function debounce(func?: any, delayTime = 200, freshTime = 1000) {
    let outTime: any;
    let _timeClock: any;
    return function () {
        const arg: any = arguments;
        _timeClock && clearTimeout(_timeClock);
        if (outTime) {
            const now: any = new Date();
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
