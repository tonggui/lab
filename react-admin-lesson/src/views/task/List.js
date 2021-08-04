import React, { Component } from "react";
import { Tabs, Table, Tag, Space,Progress } from 'antd';
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
        loading: false,
        currentTab:1
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
        attackLists({"type": 'white'}).then(response => {  // resolves
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
                    title: '任务名称',
                    dataIndex: 'taskname',
                    key: 'taskname',
                    render: text => <a>{text}</a>,
                },
                {
                    title: '任务创建时间',
                    dataIndex: 'time',
                    key: 'time',
                },
                {
                    title: '备注',
                    dataIndex: 'taskremark',
                    key: 'taskremark',
                },
                {
                    title: '完成度',
                    key: 'rate',
                    dataIndex: 'rate',
                    render: rate => (
                        <>
                            <Progress type="circle" percent={rate * 100} width={50}/>
                        </>
                    ),
                },
                {
                    title: '处理状态',
                    key: 'status',
                    dataIndex: 'status',
                    render: (status, record) => {
                        let text,color
                        if (status === -1) {
                            text = '失败'
                            color =  'volcano'
                        }else {
                            text = status === 0 ? "处理中" : "成功"
                            color = status === 0 ? 'geekblue' : 'green'
                        }
                        return (
                            <Tag color={color} key={status}>
                                {text}
                            </Tag>
                        )
                    }
                },
                {
                    title: '查看任务',
                    key: 'action',
                    render: (text, record) => {
                        let params = {
                            type : 1,
                            record: record,
                            id : record.id
                        }
                        if (record.status === 1) {
                            return (
                                <Space size="middle" disabled={true}>
                                    <Link to={{
                                        pathname: `/index/task/detail/${record.id}`,
                                        state: params,
                                    }}>查看详情
                                    </Link>
                                </Space>
                            )
                        } else {
                            return (
                                <Space size="middle">
                                    <span>查看详情
                                    </span>
                                </Space>
                            )
                        }
                    },
                },
            ],
            data: [
                {
                    "id": 23,
                    "taskname": "ss",
                    "taskremark": "ss",
                    "rate": 0.88,
                    "type": "目标消失",
                    "resultset": "{\"untargeted\": {\"eps\": [], \"img\": []}, \"vanishing\": {\"eps\": [], \"img\": []}, \"fabrication\": {\"eps\": [], \"img\": []}, \"mislabeling_ml\": {\"eps\": [], \"img\": []}, \"mislabeling_ll\": {\"eps\": [], \"img\": []}}",
                    "status": 0,
                    "time": "2021-08-04 18:28:35"
                },
                {
                    "id": 24,
                    "taskname": "ss",
                    "taskremark": "ss",
                    "rate": 0.0,
                    "type": "目标消失",
                    "resultset": "{\"untargeted\": {\"eps\": [], \"img\": []}, \"vanishing\": {\"eps\": [], \"img\": []}, \"fabrication\": {\"eps\": [], \"img\": []}, \"mislabeling_ml\": {\"eps\": [], \"img\": []}, \"mislabeling_ll\": {\"eps\": [], \"img\": []}}",
                    "status": -1,
                    "time": "2021-08-04 18:28:57"
                },
                {
                    "id": 25,
                    "taskname": "s",
                    "taskremark": "ss",
                    "rate": 1.0,
                    "type": "目标消失",
                    "resultset": "{\"untargeted\": {\"eps\": [], \"img\": []}, \"vanishing\": {\"eps\": [], \"img\": []}, \"fabrication\": {\"eps\": [], \"img\": []}, \"mislabeling_ml\": {\"eps\": [], \"img\": []}, \"mislabeling_ll\": {\"eps\": [], \"img\": []}}",
                    "status": 1,
                    "time": "2021-08-04 11:41:43"
                },
                {
                    "id": 26,
                    "taskname": "YOLO目标检测算法白盒评估-20210804",
                    "taskremark": "基于MobileNet的YOLO算法白盒安全评估",
                    "rate": 1.0,
                    "type": "识别不到目标,目标消失,制造标签,错误标签1,错误标签2",
                    "resultset": "{\"untargeted\": {\"eps\": [], \"img\": []}, \"vanishing\": {\"eps\": [], \"img\": []}, \"fabrication\": {\"eps\": [], \"img\": []}, \"mislabeling_ml\": {\"eps\": [], \"img\": []}, \"mislabeling_ll\": {\"eps\": [], \"img\": []}}",
                    "status": 1,
                    "time": "2021-08-04 10:41:43"
                }
            // ]
            // ,data : [
            //     {
            //         key: '1',
            //         name: 'attack1',
            //         create: '2021-01-01',
            //         remark: 'New York No. 1 Lake Park',
            //         status: ['success'],
            //         rate:'0'
            //     },
            //     {
            //         key: '2',
            //         name: 'attack2',
            //         create: '2021-01-02',
            //         remark: 'London No. 1 Lake Park',
            //         status: ['error'],
            //         rate:'0'
            //     },
            //     {
            //         key: '3',
            //         name: 'attack3',
            //         create: '2021-01-03',
            //         remark: 'Sidney No. 1 Lake Park',
            //         status: ['success'],
            //         rate:'70'
            //     },
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
        this.setState({currentTab:key})
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
                    title: '任务名称',
                    dataIndex: 'taskname',
                    key: 'taskname',
                    render: text => <a>{text}</a>,
                },
                {
                    title: '任务创建时间',
                    dataIndex: 'time',
                    key: 'time',
                },
                {
                    title: '备注',
                    dataIndex: 'taskremark',
                    key: 'taskremark',
                },
                {
                    title: '完成度',
                    key: 'rate',
                    dataIndex: 'rate',
                    render: rate => (
                        <>
                            <Progress type="circle" percent={rate * 100} width={50}/>
                        </>
                    ),
                },
                {
                    title: '处理状态',
                    key: 'status',
                    dataIndex: 'status',
                    render: (status, record) => {
                        let text,color
                        if (status === -1) {
                            text = '失败'
                            color =  'volcano'
                        }else {
                            text = status === 0 ? "处理中" : "成功"
                            color = status === 0 ? 'geekblue' : 'green'
                        }
                        return (
                            <Tag color={color} key={status}>
                                {text}
                            </Tag>
                        )
                    }
                },
                {
                    title: '查看任务',
                    key: 'action',
                    render: (text, record) => {
                        let params = {
                            type : 2,
                            record: record,
                            id : record.id
                        }
                        if (record.status === 1) {
                            return (
                                <Space size="middle">
                                    <Link to={{
                                        pathname: `/index/task/detail/${record.id}`,
                                        state: params,
                                    }}>查看详情 {'sssqqq'+record.taskname}
                                    </Link>
                                </Space>
                            )
                        } else {
                            return (
                                <Space size="middle" disabled={true}>
                                    <span>查看详情  {'sssqqq'+record.taskname}
                                    </span>
                                </Space>
                            )
                        }
                    },
                },
            ],
            blackData : [
                {
                    "id": 23,
                    "taskname": "ss",
                    "taskremark": "ss",
                    "rate": 0.88,
                    "type": "目标消失",
                    "resultset": "{\"untargeted\": {\"eps\": [], \"img\": []}, \"vanishing\": {\"eps\": [], \"img\": []}, \"fabrication\": {\"eps\": [], \"img\": []}, \"mislabeling_ml\": {\"eps\": [], \"img\": []}, \"mislabeling_ll\": {\"eps\": [], \"img\": []}}",
                    "status": 0,
                    "time": "2021-08-04 18:28:35"
                },
                {
                    "id": 24,
                    "taskname": "ss",
                    "taskremark": "ss",
                    "rate": 0.0,
                    "type": "目标消失",
                    "resultset": "{\"untargeted\": {\"eps\": [], \"img\": []}, \"vanishing\": {\"eps\": [], \"img\": []}, \"fabrication\": {\"eps\": [], \"img\": []}, \"mislabeling_ml\": {\"eps\": [], \"img\": []}, \"mislabeling_ll\": {\"eps\": [], \"img\": []}}",
                    "status": -1,
                    "time": "2021-08-04 18:28:57"
                },
                {
                    "id": 25,
                    "taskname": "s",
                    "taskremark": "ss",
                    "rate": 1.0,
                    "type": "目标消失",
                    "resultset": "{\"untargeted\": {\"eps\": [], \"img\": []}, \"vanishing\": {\"eps\": [], \"img\": []}, \"fabrication\": {\"eps\": [], \"img\": []}, \"mislabeling_ml\": {\"eps\": [], \"img\": []}, \"mislabeling_ll\": {\"eps\": [], \"img\": []}}",
                    "status": 1,
                    "time": "2021-08-04 11:41:43"
                }
            ],})
    }
    render(){
        const { columns, data,blackColumns,blackData} = this.state;
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={this.handleChange}>
                    <TabPane tab="白盒攻击任务" key="1">
                        <Table columns={columns} dataSource={data} rowKey={record => record.id} />
                    </TabPane>
                    <TabPane tab="黑盒攻击任务" key="2">
                        <Table columns={blackColumns} dataSource={blackData} rowKey={record => record.id}/>
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
