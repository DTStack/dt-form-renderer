import React from 'react';
import xss from 'xss';

/**
 * @description 防止 xss 攻击
 * @returns
 */
const safeInnerHtml = (tooltip) => {
    const safeTooltip = xss(tooltip);
    return <div dangerouslySetInnerHTML={{ __html: safeTooltip }} />;
};

export default safeInnerHtml;
