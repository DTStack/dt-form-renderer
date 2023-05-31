import * as React from 'react';
import type { DocsMapType } from '@dt-form-renderer/core';

const extraConfigDoc = (
    <div>
        以JSON格式添加高级参数，例如对关系型数据库可配置fetchSize，每类数据源支持不同的参数，可参考
        <a href="#" target="blank">
            《帮助文档》
        </a>
    </div>
);

const dataFilterDoc = (
    <div>
        where 条件即针对源头数据筛选条件，根据指定的 column、table、where
        条件拼接 SQL 进行数据抽取，暂时不支持limit关键字过滤。利用 where
        条件可进行全量同步和增量同步，具体说明如下：
        <br />
        <ul>
            <li>
                1）全量同步：第一次做数据导入时通常为全量导入，可不用设置 where
                条件。
            </li>
            <li>
                2）增量同步：增量导入在实际业务场景中，往往会选择当天的数据进行同步，通常需要编写
                where
                条件语句，请先确认表中描述增量字段（时间戳）为哪一个。如tableA增量的字段为create_time，则填写create_time{' '}
                {`>`} 您需要的日期，如果需要日期动态变化，请参考帮助文档。
            </li>
        </ul>
    </div>
);

const docs: DocsMapType = {
    extraConfigDoc,
    dataFilterDoc,
};

export default docs;
