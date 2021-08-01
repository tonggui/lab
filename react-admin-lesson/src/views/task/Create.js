import React, { Component } from "react";
import TaskSteps from "../index/components/steps/index";
import {withRouter} from "react-router-dom";
import {Button} from "antd";
class TaskCreate extends Component {
    render(){
        return (
            <div>
                <TaskSteps  history={this.props.history}>
                </TaskSteps>
            </div>
        )
    }
}
export default withRouter(TaskCreate);
