import React, { Component, Fragment } from "react";
import { Steps, Button, message, Select, Input, Form } from 'antd';
import Steps2 from './steps2'
import './steps.scss'
import TaskForm from "./taskForm";
import {CreateWhiteTask, CreateBlackTask,WhiteMethods,BlackMethods} from "../../../../api/task";
import {
    setTaskRemark,
    getTaskRemark,
    getTaskName,
    setTaskName,
    getBlackParams,
    getWhiteParams, getAttackType,
    deleteAttackType,deleteBlackParams,deleteWhiteParams,deleteTaskName,deleteTaskRemark
} from "../../../../utils/cookies"
import {withRouter} from "react-router-dom";

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const steps = [
    {
        title: '填写任务信息'
    },
    {
        title: '完善算法信息',
        content: (<div  style={{marginTop:30, marginBottom:150, marginLeft:20, paddingLeft:150}}>
            <div>
                <p>攻击方法选择：</p>
            </div>
            <div style={{marginLeft:20, marginTop:20}}>
                <Steps2>
                </Steps2>
            </div>
        </div>),
    }
];
let timer
class TaskSteps extends Component{
    state = {
        current:0,
        taskName:"",
        taskRemark:"",
        methodType:0,
        loading: false,
        status:true,
        timer:null,
        WhiteMethods:[],
        BlackMethods:[]
    }
    next = () => {
        this.setState({current: this.state.current + 1});
    };
    prev = () => {
        this.setState({current: this.state.current - 1});
    };
    handleSubmit = () => {
        let requestData = {
            "taskName":getTaskName(),
            "taskRemark": getTaskRemark(),
            "method": getWhiteParams()
        }
        if (getAttackType() === 2) {
            requestData["method"] = getBlackParams()
        }
        console.log("requestData:", requestData)
        this.setState({
            loading: true
        })
        console.log(requestData)
        const requestType = getAttackType() == 2 ? CreateBlackTask : CreateWhiteTask
        requestType(requestData).then(response => {  // resolves
            const info = response.data.info
            message.error(info,5000)
            this.setState({
                loading: false
            })
            // 路由跳转
        }).catch(error => {  // reject
            this.state.status=!this.state.status
            // window.location.href="/index/task/list";
            this.props.history.push('/index/task/list');
            deleteTaskName()
            deleteTaskRemark()
            deleteAttackType()
            deleteWhiteParams()
            deleteBlackParams()
            message.success('创建成功!')
            this.setState({current: 0})
            this.setState({
                loading: false
            })
        })
        console.log('Received values of form: ', requestData);
    };
    componentDidMount() {
        WhiteMethods().then(response => {  // resolves
            const info = response.data.info
            this.setState({WhiteMethods:info})
            console.log(info)
            this.setState({
                loading: false
            })
        }).catch(error => {
            this.setState({
                loading: false
            })
        })
        BlackMethods().then(response => {
            const info = response.data.info
            this.setState({BlackMethods:info})
            console.log(info)
            this.setState({
                loading: false
            })
        }).catch(error => {
            this.setState({
                loading: false
            })
        })
    }

    componentWillUnmount() {
        this.setState = ()=>false;
    }
    getTaskInfo = (result, msg) => {
        console.log(result, msg)
        this.setState({
            childrenMsg: msg
        })
    }
    render() {
        const { current, taskName, taskRemark,loading} = this.state;
        return (
            <>
                <Steps current={current} style={{marginTop:30,marginBottom:20, paddingLeft:150,paddingRight:200}}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{current == 0 ? (<TaskForm next={this.next}></TaskForm>) : steps[current].content}</div>
                <div className="steps-action">
                    {current === 1 && (
                        <Button type="primary" loading={loading} onClick={this.handleSubmit} style={{ margin: '0 8px' }}>
                            确认提交
                        </Button>
                    )}
                    {/*{current === steps.length - 1 && (*/}
                    {/*    <Button type="primary" onClick={() => message.success('Processing complete!')}>*/}
                    {/*        返回*/}
                    {/*    </Button>*/}
                    {/*)}*/}
                    {current === 1 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                            上一步
                        </Button>
                    )}
                </div>
            </>
        );
    }
};
export default withRouter(TaskSteps)
