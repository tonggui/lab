import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
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
            <PrivateRouter exact key="/index/task/create" path="/index/task/create" component={TaskCreate} />
          <PrivateRouter exact key="/index/task/list"  path="/index/task/list" component={TaskList} />
          <PrivateRouter exact key={`/index/task/detail/:id`} path = {`/index/task/detail/:id`} component={Detail} />
            <Redirect form='/*' to={"/index/task/create"} />
        </Switch>
    )
  }
}
export default ContainerMain;
