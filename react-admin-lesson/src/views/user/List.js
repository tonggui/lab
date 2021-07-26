import React, { Component } from "react";
import TaskSteps from "../index/components/steps/index";
class UserList extends Component {
    constructor(props){
        super(props);
        this.state = {
            current:0
        };
    }
    render(){
        return (
            <div>
                <TaskSteps current={this.state.current}>
                </TaskSteps>
            </div>
        )
    }
}
export default UserList;
