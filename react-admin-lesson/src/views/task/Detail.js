import React, { Component } from "react";
import WhiteDetail from "../index/components/detail/whiteAttack";
import BlackDetail from "../index/components/detail/blackAttack";
import {withRouter} from "react-router-dom";

class TaskDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            attackType: 1
        };
    }
    render(){
        if (this.state.attackType) {
            return (
                <div>
                    <WhiteDetail>
                    </WhiteDetail>
                </div>
            )
        } else {
            return (
                <div>
                    <BlackDetail>
                    </BlackDetail>
                </div>
            )
        }
    }
}
export default withRouter(TaskDetail);
