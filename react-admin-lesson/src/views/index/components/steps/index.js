import React, { Component, Fragment } from "react";
import { Steps, Button, message, Select, Input, Form } from 'antd';
import Steps2 from './steps2'
import Steps3 from './steps3'
import './steps.scss'
import TaskForm from "./taskForm";
import {Login} from "../../../../api/account";
import { setTaskRemark,getTasRemark, getTaskName,setTaskName } from "../../../../utils/cookies"
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
        content: (<div  style={{marginTop:30, marginBottom:150, marginLeft:20}}>
            <div>
                <p>攻击方法选择：</p>
            </div>
            <div style={{marginLeft:20, marginTop:20}}>
                <Steps2>
                </Steps2>
            </div>
        </div>),
    },
    {
        title: '创建完成',
        content: (<div style={{marginTop:30}}>
            <div >
                <Steps3>
                </Steps3>
            </div>
        </div>),
    },
];
class TaskSteps extends Component{
    constructor(props){
        super(props);
        console.log(props.params)
        this.state = {
            current:0,
            taskName:"",
            taskRemark:"",
            methodType:0,
            loading: false
        }
    }

    next = () => {
        this.setState({current: this.state.current + 1});
    };
    prev = () => {
        this.setState({current: this.state.current - 1});
    };
    handleSubmit = () => {
        const requestData = {
            taskName:getTaskName(),
            taskRemark: getTasRemark(),
            code: this.state.methodType,
        }
        // this.setState({
        //     loading: true
        // })
        this.props.history.push('/index/task/list');
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
    getTaskInfo = (result, msg) => {
        console.log(result, msg)
        this.setState({
            childrenMsg: msg
        })
    }
    render() {
        const { current, taskName, taskRemark} = this.state;
        return (
            <>
                <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{current == 0 ? (<TaskForm next={this.next}></TaskForm>) : steps[current].content}</div>
                <div className="steps-action">
                    {current === 1 && (
                        <Button type="primary" onClick={this.handleSubmit} style={{ margin: '0 8px' }}>
                            确认提交
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            返回
                        </Button>
                    )}
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
export default TaskSteps
