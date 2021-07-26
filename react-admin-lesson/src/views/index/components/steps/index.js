import React, { Component, Fragment } from "react";
import { Steps, Button, message, Select, Input, Form } from 'antd';
import Steps2 from './steps2'
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const TaskForm = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >
            <Form.Item
                label="任务名称"
                name="taskname"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="任务备注"
                name="taskremark"
            >
                <TextArea />
            </Form.Item>
        </Form>
    );
};

const onChange = e => {
    console.log(e);
};
const steps = [
    {
        title: '填写任务信息',
        content: (<div  style={{marginTop:30, marginBottom:150, marginLeft:20}}>
            <TaskForm>
            </TaskForm>
        </div>)
    },
    {
        title: '完善算法信息',
        content: (<div  style={{marginTop:30, marginBottom:150, marginLeft:20}}>
            <div>
                <p >攻击方法选择：</p>
            </div>
            <div >
                <Steps2>
                </Steps2>
            </div>
        </div>),
    },
    {
        title: '创建完成',
        content: 'Last-content',
    },
];
const TaskSteps = () => {
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const handleSubmit = () => {

    }
    return (
        <>
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
                {current === 0 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === 1 && (
                    <Button type="primary" onClick={handleSubmit()}>
                        确认提交
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        返回
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </>
    );
};


export default TaskSteps
