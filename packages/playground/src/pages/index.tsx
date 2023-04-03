import { useLayoutEffect } from 'react';
import Playground from './playground';
import { Provider } from 'react-redux';
import store, { syncIDB2Redux } from '@/store';
import './styles/ant-cover.css';

export default function IndexPage() {
    useLayoutEffect(() => {
        syncIDB2Redux()
    },[])
    return (
        <Provider store={store}>
            <Playground />
        </Provider>
    );
}
