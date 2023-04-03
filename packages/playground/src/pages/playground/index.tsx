import React from 'react';
import WorkBench from './workbench/workbench';
import HeaderBar from './headerBar';
import './playground.less';


const Playground: React.FC = () => {
    return (
            <div className="playground">
                <div className="playground-header">
                    <div className="playground-header-title">Playground</div>
                    <HeaderBar/>
                </div>
                <div className="playground-content">
                    <WorkBench/>
                </div>
            </div>
    );
};

export default Playground;
