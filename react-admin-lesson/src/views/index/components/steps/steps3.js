import React, { Component } from "react";
import WhiteDetail from "../detail/whiteAttack";
import BlackDetail from "../detail/blackAttack";
import Success from "./data"

class TaskDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            attackType: 1,
        };
    }
    render(){
        if (this.state.attackType) {
            return (
                <div>
                    <WhiteDetail success={Success}>
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
export default TaskDetail;
