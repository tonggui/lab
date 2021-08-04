import React, { Component } from "react";
import { Tabs, Table, Tag, Space } from 'antd';
import {withRouter} from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    deleteAttackType, deleteBlackParams,
    deleteTaskName,
    deleteTaskRemark,
    deleteWhiteParams,
    getTaskName,
    getTaskRemark
} from "../../utils/cookies";
import {attackLists,WhiteDetailed,BlackDetailed} from "../../api/task";

const { TabPane } = Tabs;
class TaskList extends Component{
    state = {
        columns : [],
        data :[],
        blackColumns:[],
        blackData:[],
        loading: false
    }
    componentDidMount() {
        this.setState({
            loading: true
        })
        // axios({
        //     method:"post",
        //     url:"/devApi/show",
        //     headers:{
        //         // 'Content-Type': 'multipart/form-data'
        //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        //     },
        //     data:{
        //         type:'white',
        //     },
        //     transformRequest: [function (data) {
        //         let ret = ''
        //         for (let it in data) {
        //             ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it])
        //         }
        //         return ret
        //     }],
        // })
        attackLists({"type": 'black'}).then(response => {  // resolves
            this.setState({
                loading: false
            })
            const data = response.data
            console.log(data)
            // 路由跳转
        }).catch(error => {  // reject
            this.setState({
                loading: false
            })
        })
        this.setState({columns : [
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
            ],
            data : [
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
            ],})
    }
    goToDetail = () => {
        const requestData = {
            taskName:getTaskName(),
            taskRemark: getTaskRemark(),
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
    handleChange = (key) => {
        console.log(key);
        if (key == 2) {
            this.setState({
                loading: true
            })
            attackLists({"type": 'black'}).then(response => {  // resolves
                this.setState({
                    loading: false
                })
                const data = response.data
                // 路由跳转
            }).catch(error => {  // reject
                this.setState({
                    loading: false
                })
            })
        }
        this.setState({blackColumns : [
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
            ],
            blackData : [
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
            ],})
    }
    render(){
        const { columns, data,blackColumns,blackData} = this.state;
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={this.handleChange}>
                    <TabPane tab="白盒攻击任务" key="1">
                        <Table columns={columns} dataSource={data} />
                    </TabPane>
                    <TabPane tab="黑盒攻击任务" key="2">
                        <Table columns={blackColumns} dataSource={blackData} />
                    </TabPane>
                </Tabs>
                <form method="post" action="http://10.112.222.93:8000/show"
                      encType="multipart/form-data">
                    <input  type="hidden" name="type" value={"white"}/>
                </form>
            </div>
        )
    }
}
export default withRouter(TaskList);
