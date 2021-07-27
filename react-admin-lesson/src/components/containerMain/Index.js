import React from 'react';
import { Switch,Route } from 'react-router-dom';
// 私有组件方法
import PrivateRouter from "../privateRouter/Index";
/** 自动化工程 */
import Components from "./components";
import TaskCreate from "../../views/user/List"
import TaskList from "../../views/user/Add"
import TaskDetail from "../../views/user/TaskDetail"
class ContainerMain extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return (
      <Route exact component={TaskCreate} path="/index/user/list" />
        // <Switch>
        //   {
        //     Components.map(item => {
        //       return <PrivateRouter exact key={item.path} path={item.path} component={item.component} />
        //     })
        //   }
        // </Switch>
    )
  }
}
export default ContainerMain;
