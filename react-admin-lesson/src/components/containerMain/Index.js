import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
// 私有组件方法
/** 自动化工程 */
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
            <Route exact key="/task/create"  path="/task/create" component={TaskCreate} />
          <Route exact key="/task/list"  path="/task/list" component={TaskList} />
          <Route exact key={`/task/detail/:id`} path = {`/task/detail/:id`} component={Detail} />
          <Redirect to={"/task/create"} />
        </Switch>
    )
  }
}
export default ContainerMain;
