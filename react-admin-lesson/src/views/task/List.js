import React, { Component } from "react";
import { Tabs, Table, Tag, Space } from 'antd';
import {withRouter} from "react-router-dom";
import { Link } from "react-router-dom";
import {getTaskName, getTasRemark} from "../../utils/cookies";

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
                    <Link to="/index/task/detail">查看详情  {record.name}
                    </Link>
                </Space>
            ),
        },
    ];
    const goToDetail = () => {
        const requestData = {
            taskName:getTaskName(),
            taskRemark: getTasRemark(),
        }
        // this.setState({
        //     loading: true
        // })
        // this.props.history.push('/index/task/detail');
        // Login(requestData).then(response => {  // resolves
        //     this.setState({
        //         loading: false
        //     })
        //     const data = response.data.data
        //     // 路由跳转
        //     this.props.history.push('/index/task/list');
        // }).catch(error => {  // reject
        //     this.setState({
        //         loading: false
        //     })
        // })
        this.setState({current: 0})
        console.log('Received values of form: ', requestData);
    };
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
export default withRouter(TaskList);
