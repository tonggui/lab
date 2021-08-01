import React, { Component, Fragment } from "react";
import { Form, Input, Button } from 'antd';
import { setTaskRemark,getTasRemark, getTaskName,setTaskName } from "../../../../utils/cookies"
import './steps.scss'

const { TextArea } = Input;

class TaskForm extends Component{
    state = {
        taskName: getTaskName() || '',
        taskRemark: getTasRemark() || ''
    }

    onFinish = (values) => {
        console.log('Received values of form: ', values,this.state);
        setTaskRemark(values.taskRemark);
        setTaskName(values.taskName);
        this.props.next();
    };

    inputChangeTaskName = (e) => {
        let value = e.target.value;
        this.setState({
            taskName: value
        })
    }
    inputChangeTaskRemark = (e) => {
        let value = e.target.value;
        this.setState({
            taskRemark: value
        })
    }
    render(){
        const { taskName, taskRemark} = this.state;
        console.log(taskName, taskRemark, this.state)
        return (
            <>
                <Form className="taskForm"
                    name="basic"
                    initialValues={{ taskName, taskRemark }}
                    onFinish={this.onFinish}
                >
                    <Form.Item name="taskName" label='任务名称：' rules={
                        [{ required: true, message: "任务名称不能为空" }]
                    }>
                        <Input value={taskName} onChange={this.inputChangeTaskName} placeholder="taskName" />
                    </Form.Item>
                    <Form.Item name="taskRemark" label='任务备注：' style={{paddingLeft:"0.8em"}}>
                        <TextArea value={taskRemark} onChange={this.inputChangeTaskRemark} placeholder="taskRemark" />
                    </Form.Item>
                    <Form.Item className="form-button">
                            <Button type="primary" htmlType="submit" block> 下一步 </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }
}

export default TaskForm;
