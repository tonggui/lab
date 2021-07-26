import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// 引用组件
import Login from './views/login/Index';
import Index from './views/index/Index';
// 私有组件方法
import PrivateRouter from "./components/privateRouter/Index";
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Route exact component={Index} path="/" />
          <PrivateRouter exact component={Index} path="/index" />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
