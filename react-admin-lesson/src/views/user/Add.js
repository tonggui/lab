import React, { Component } from "react";
import { Tabs, Table, Tag, Space } from 'antd';

const { TabPane } = Tabs;
const TaskList = ()=>{
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Create',
            dataIndex: 'create',
            key: 'create',
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <>
                    {status.map(statu => {
                        let color = 'green';
                        if (statu === 'error') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={statu}>
                                {statu.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: '查看任务',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a>查看详情  {record.name}</a>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            name: 'attack1',
            create: '2021-01-01',
            remark: 'New York No. 1 Lake Park',
            status: ['success'],
        },
        {
            key: '2',
            name: 'attack2',
            create: '2021-01-02',
            remark: 'London No. 1 Lake Park',
            status: ['error'],
        },
        {
            key: '3',
            name: 'attack3',
            create: '2021-01-03',
            remark: 'Sidney No. 1 Lake Park',
            status: ['success'],
        },
    ];
    const callback = (key) => {
        console.log(key);
    }
    return (
        <div>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="白盒攻击任务" key="1">
                    <Table columns={columns} dataSource={data} />
                </TabPane>
                <TabPane tab="黑盒攻击任务" key="2">
                    Content of Tab Pane 2
                </TabPane>
            </Tabs>
        </div>
    )
}
export default TaskList;
