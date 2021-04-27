import React, { Component, Fragment } from "react";
// 
import { Link } from "react-router-dom";
// antd
import { Button, Switch, message } from "antd";
// api
import { Status } from "@api/department";
// table 组件
import TableComponent from "@c/tableData/Table";
import FormSearch from "@c/formSearch/Index";
// Store
import Store from "@/stroe/Index";
// action
import { addStatus, uploadStatus } from "@/stroe/action/Config";
class DepartmentList extends Component {
    constructor(props){
        super(props);
        this.state = {
            // id
            id: "",
            // flag
            flag: false,
            // 请求参数
            pageNumber: 1,
            pageSize: 10,
            keyWork: "",
            // 筛选 form
            formItem: [
                { 
                    type: "Input",
                    label: "部门名称", 
                    name: "name", 
                    placeholder: "请输入部门名称"
                },
                { 
                    type: "Select",
                    label: "禁启用", 
                    name: "status", 
                    placeholder: "请选择",
                    style: { width: "100px" },
                    optionsKey: "status"
                },
            ],
            // 表头
            tableConfig: {
                url: "departmentList",
                checkbox: true,
                rowKey: "id",
                thead: [
                    { 
                        title: "部门名称", 
                        dataIndex: "name", 
                        key: "name",
                        render: (name, rowData) => {
                            return <a href={rowData.id}>{name}</a>
                        }
                    },
                    { 
                        title: "禁启用", 
                        dataIndex: "status", 
                        key: "status",
                        render: (status, rowData) => {
                            return <Switch onChange={() => this.onHandlerSwitch(rowData)} loading={rowData.id === this.state.id} checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={status === "1" ? true : false} />
                        }
                    },
                    { title: "人员数量", dataIndex: "number", key: "number" },
                    { 
                        title: "操作", 
                        dataIndex: "operation", 
                        key: "operation", 
                        width: 215,
                        render: (text, rowData) => {
                            return (
                                <div className="inline-button">
                                    <Button type="primary">
                                        <Link to={{ pathname: '/index/department/add', state:{ id: rowData.id}}}>编辑</Link>
                                    </Button>
                                    <Button onClick={() => this.delete(rowData.id)}>删除</Button>
                                    {/* 
                                        在父组件获取子组件的实例
                                        1、在子组件调用父组件方法，并把子组件实例传回给父组件，（已经存储了子组件的实例）
                                        2、通过实例调用子组件的方法
                                    */}
                                </div>
                            )
                        }
                    }
                ],
                
            },
            // 表的数据
            data: []
        };
    }
    /** 生命周期挂载完成 */
    componentDidMount(){
        
    }
    // 获取子组件实例
    getChildRef = (ref) => {
        this.tableComponent = ref; // 存储子组件
    }
    
    /** 禁启用 */
    onHandlerSwitch(data){
        if(!data.status) { return false; }
        if(this.state.flag) { return false; }
        const requestData = {
            id: data.id,
            status: data.status === "1" ? false : true
        }
        // 第一种做法，用组件本身异步
        this.setState({id: data.id}) 
        // 第二种做法，自己做的开关
        // this.setState({flag: true}) 
        Status(requestData).then(response => {
            message.info(response.data.message);
            this.setState({id: ""})
            // this.setState({flag: false}) 
        }).catch(error => {
            this.setState({id: ""})
            // this.setState({flag: false}) 
        })
    }
    /** 删除 */
    delete = (id) => {
        this.tableComponent.onHandlerDelete(id)
    }
    render(){
        return (
            <Fragment>
                <FormSearch formItem={this.state.formItem} />
                <TableComponent config={this.state.tableConfig} />
            </Fragment>
        )
    }
}
export default DepartmentList;