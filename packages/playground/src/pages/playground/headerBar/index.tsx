import React, { useEffect, useMemo, useState } from 'react';
import {
    Checkbox,
    Select,
    Tooltip,
    Modal,
    message,
    Input,
    Form,
    Popconfirm,
} from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import {
    SaveOutlined,
    FileAddOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store';
import {
    setWIP,
    createFile,
    updateFile,
    removeFile,
} from '@/store/reducers/workbenchSlice';
import { DefaultWip } from '@/store/reducers/workbenchSlice';
import { downloadFile } from '@/utils';
import './headerbar.less';

const FormItem = Form.Item;

interface HeaderBarProps {}
const HeaderBar: React.FC<HeaderBarProps> = (props) => {
    const [visible, toggle] = useState(false);
    const dispatch = useAppDispatch();
    const {
        workbench: { workInProgress, files },
    } = useSelector<RootState, RootState>((state) => state);

    const options = useMemo<DefaultOptionType[]>(() => {
        return files.map((file) => ({ label: file.name, value: file.name }));
    }, [files]);

    const createFileRecord = () => {
        if (workInProgress === DefaultWip) {
            message.error('当前编辑的文件记录未命名，请先保存！');
            return;
        }
        const index = files.findIndex((item) => item.name === DefaultWip);
        if (index === -1) {
            dispatch(createFile());
            dispatch(setWIP(DefaultWip));
        } else {
            message.error(
                '当前有未命名保存的文件记录 untitled，请先保存 untitled！'
            );
        }
    };
    const disabledDelete = files.length < 2;

    const deleteFileRecord = () => {
        if (disabledDelete) return;
        if (files.length === 1) {
            message.error('无法删除！');
        } else {
            const file = files.find((f) => f.name !== workInProgress);
            dispatch(removeFile(workInProgress));
            dispatch(setWIP(file.name));
        }
    };

    return (
        <>
            <div className="playground-header-bar">
                <Tooltip title="新建文件记录">
                    <FileAddOutlined onClick={createFileRecord} />
                </Tooltip>
                <Popconfirm
                    title="确定要删除此文件记录吗？"
                    onConfirm={deleteFileRecord}
                    okText="删除"
                    cancelText="取消"
                    disabled={disabledDelete}
                >
                    <Tooltip title="删除当前文件记录">
                        <DeleteOutlined
                            disabled={disabledDelete}
                            style={
                                disabledDelete
                                    ? { color: '#aaa', cursor: 'not-allowed' }
                                    : {}
                            }
                        />
                    </Tooltip>
                </Popconfirm>

                <Tooltip title="另存为文件记录">
                    <SaveOutlined
                        onClick={() => {
                            toggle(true);
                        }}
                    />
                </Tooltip>
                <span className="span-divider" />
                <Select
                    style={{ width: 180 }}
                    options={options}
                    value={workInProgress}
                    onSelect={(v) => {
                        dispatch(setWIP(v));
                    }}
                />
                {/* <Checkbox
                    checked={autoSave}
                    onChange={(e) => {
                        dispatch(setAutoSave(e.target.checked))
                    }}
                >
                    自动保存
                </Checkbox> */}
            </div>
            <SaveModal visible={visible} toggle={toggle} />
        </>
    );
};

export default HeaderBar;

interface SaveModalProps {
    visible: boolean;
    toggle: (...args: any) => any;
}

function SaveModal(props: SaveModalProps) {
    const { visible, toggle } = props;
    const [name, setName] = useState('');
    const [checked, setChecked] = useState(false);
    const dispatch = useAppDispatch();
    const {
        workbench: { workInProgress, files },
        configure: { autoSave },
    } = useSelector<RootState, RootState>((state) => state);

    useEffect(() => {
        if (!visible) {
            setName('');
            setChecked(false);
        }
    }, [visible]);

    const onSave = () => {
        if (!name) {
            return message.error('请输入文件记录名称！');
        }
        if (name === DefaultWip) {
            return message.error('名称不能为 untitled！');
        }
        if (files.find((item) => item.name === name)) {
            return message.error('此文件名已存在！');
        }
        const wipFile = files.find((item) => item.name === workInProgress);
        dispatch(
            updateFile({
                fileName: workInProgress,
                fileMeta: {
                    ...wipFile,
                    name,
                },
            })
        );
        dispatch(setWIP(name));
        if (checked) {
            downloadFile(wipFile.configContent, name);
        }
        toggle(false);
    };

    return (
        <Modal
            title="另存为文件记录"
            open={visible}
            destroyOnClose
            maskClosable={false}
            onCancel={() => {
                toggle(false);
            }}
            onOk={onSave}
        >
            <FormItem required label="文件记录名称">
                <Input
                    style={{ width: '100%' }}
                    name={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
            </FormItem>
            <FormItem label="是否同时下载表单项配置">
                <Checkbox
                    onChange={(e) => setChecked(e.target.checked)}
                    checked={checked}
                />
            </FormItem>
        </Modal>
    );
}
