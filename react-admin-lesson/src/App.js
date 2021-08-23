import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {withRouter} from "react-router-dom";
// 引用组件
import Index from './views/index/Index';
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return (
        <BrowserRouter>
          <Switch>
            <Route component={Index} path="/"/>
          </Switch>
        </BrowserRouter>
    )
  }
}

export default App;
