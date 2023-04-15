import { DATA_SOURCE_TEXT } from '../../support/const/stream';

export interface DataSourceType {
    type: number;
    name: string;
}

const allDataSourceTypeList: DataSourceType[] = Object.entries(
    DATA_SOURCE_TEXT,
).map(([type, name]) => {
    return {
        type: +type,
        name,
    };
});

export interface DataSourceItem {
    type: number;
    id: number;
    name: string;
}

const allDataSourceList: DataSourceItem[] = [];
allDataSourceTypeList.forEach(({ type, name }, index) => {
    allDataSourceList.push({
        type,
        id: 500 + type * (index + 1),
        name: `${name.replace(/\s/g, '_')}_1`.toLowerCase(),
    });
    allDataSourceList.push({
        type,
        id: 1000 + type * (index + 2),
        name: `${name.replace(/\s/g, '_')}_2`.toLowerCase(),
    });
});

export { allDataSourceList, allDataSourceTypeList };
