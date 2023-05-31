import {
    allDataSourceList,
    allDataSourceTypeList,
    DataSourceType,
    DataSourceItem,
} from './mockData/streamSource';

/**
 * 根据数据源类型获取对应的数据源列表
 */
const getSourceListViaType = (sourceType) => {
    const sourceList = allDataSourceList.filter(
        ({ type }) => type === sourceType
    );
    return new Promise<DataSourceItem[]>((resolve) => {
        setTimeout(() => {
            resolve(sourceList);
        }, 1000);
    });
};

/**
 * 获取数据来源的类型
 */
const getSourceTypeList = () => {
    return new Promise<DataSourceType[]>((resolve) => {
        setTimeout(() => {
            resolve(allDataSourceTypeList);
        }, 1000);
    });
};

export { getSourceListViaType, getSourceTypeList };
