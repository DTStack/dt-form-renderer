import { openDB } from 'idb';
import { RootState } from '.';
import { initialState as initialConfig } from './reducers/configureSlice';
import { initialState as initialWorkbench } from './reducers/workbenchSlice';

const currentVersion = 1;

export const IDB_NAME = 'WORKSPACE';

/**
 * @description store 名称
 */
export const idbStores = {
    CONFIG: 'configure',
    WORKBENCH: 'workbench',
};

/**
 * @description configure store key
 */
export const configStoreKey = {
    AUTO_SAVE: 'autoSave',
};

/**
 * @description workbench store key
 */
export const workbenchStoreKey = {
    FILES: 'files',
    WIP: 'workInProgress',
};

export function initIDB() {
    openDB(IDB_NAME, currentVersion, {
        upgrade: (db, oldVersion, newVersion) => {
            if (!oldVersion && newVersion === 1) {
                db.createObjectStore(idbStores.CONFIG);
                db.createObjectStore(idbStores.WORKBENCH);
                console.log(
                    `Init IndexDB Success!\nCurrentVersion: ${newVersion}\nPrevVersion: ${oldVersion}`
                );
            }
        },
    });
}

export function syncRedux2IDB(store: RootState) {
    const { workbench, configure } = store;
    return openDB(IDB_NAME, currentVersion).then((idb) => {
        const transaction = idb.transaction(
            [idbStores.WORKBENCH, idbStores.CONFIG],
            'readwrite'
        );
        transaction
            .objectStore(idbStores.WORKBENCH)
            .put(workbench.files, workbenchStoreKey.FILES);
        transaction
            .objectStore(idbStores.WORKBENCH)
            .put(workbench.workInProgress, workbenchStoreKey.WIP);
        transaction
            .objectStore(idbStores.CONFIG)
            .put(configure.autoSave, configStoreKey.AUTO_SAVE);
        idb.close();
    });
}

export function getAllIDBData() {
    return openDB(IDB_NAME, currentVersion).then((idb) => {
        const transaction = idb.transaction(
            [idbStores.CONFIG, idbStores.WORKBENCH],
            'readonly'
        );
        const promises = [
            transaction
                .objectStore(idbStores.CONFIG)
                .get(configStoreKey.AUTO_SAVE),
            transaction
                .objectStore(idbStores.WORKBENCH)
                .get(workbenchStoreKey.FILES),
            transaction
                .objectStore(idbStores.WORKBENCH)
                .get(workbenchStoreKey.WIP),
        ];
        return Promise.all(promises).then(
            ([autoSave, files, workInProgress]) => {
                return {
                    configure:
                        autoSave === undefined
                            ? initialConfig
                            : {
                                  autoSave,
                              },
                    workbench:
                        workInProgress === undefined
                            ? initialWorkbench
                            : {
                                  files,
                                  workInProgress,
                              },
                };
            }
        );
    });
}
