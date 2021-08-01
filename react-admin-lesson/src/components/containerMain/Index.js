import React from 'react';
import { Switch,Route } from 'react-router-dom';
// 私有组件方法
import PrivateRouter from "../privateRouter/Index";
/** 自动化工程 */
import Components from "./components";
import TaskCreate from "../../views/task/Create"
import TaskList from "../../views/task/List"
import Detail from "../../views/task/Detail"
class ContainerMain extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return (
        <Switch>
          {
            Components.map(item => {
              return <PrivateRouter exact key={item.path} path={item.path} component={item.component} />
            })
          }
        </Switch>
    )
  }
}
export default ContainerMain;
