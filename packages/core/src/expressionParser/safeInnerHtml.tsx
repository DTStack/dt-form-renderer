import xss from 'xss';

const safeInnerHtml = (tooltip) => {
    const safeTooltip = xss(tooltip);
    return <div dangerouslySetInnerHTML={{ __html: safeTooltip }} />;
};

export default safeInnerHtml;
