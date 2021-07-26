import React from "react";
import { Route, Redirect } from "react-router-dom";
// 方法
import { getToken } from "../../utils/cookies";
const PrivateRouter = ({ component: Component, ...rest }) => {
    return (
      <Route {...rest} render={routeProps => (
          <Component {...routeProps} />
      )} />
    );
}
export default PrivateRouter;

