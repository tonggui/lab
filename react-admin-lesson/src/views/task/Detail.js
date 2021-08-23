import React, { Component } from "react";
import WhiteDetail from "../index/components/detail/whiteAttack";
import BlackDetail from "../index/components/detail/blackAttack";
import {withRouter} from "react-router-dom";

class TaskDetail extends Component {
    constructor(props){
        super(props);
        console.log(this.props.location.state)
        this.state = {
            attackType: this.props.location.state.type
        };
    }
    render(){
        return (
            <div>
                <WhiteDetail attackType={this.state.attackType} record={this.props.location.state.record}>
                </WhiteDetail>
            </div>
        )
    }
}
export default withRouter(TaskDetail);
