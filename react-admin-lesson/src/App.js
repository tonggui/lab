import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {withRouter} from "react-router-dom";
// 引用组件
import Index from './views/index/Index';
// 私有组件方法
import PrivateRouter from "./components/privateRouter/Index";
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
      console.log(this.props)
    return (
        <BrowserRouter>
          <Switch>
            <Route component={Index} path="/"/>
            <PrivateRouter component={Index} path="/index/task/create" />
            <PrivateRouter component={Index} path="/index/task/list" />
          </Switch>
        </BrowserRouter>
    )
  }
}

export default App;
