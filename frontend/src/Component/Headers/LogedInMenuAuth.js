import React from "react";

import {LogedInMenu} from "./LogedInMenu";

//import { useAuth0 } from "@auth0/auth0-react";

export const LogedInMenuAuth = (props) => {
  return ((typeof props.token !== 'undefined' && props.token !== null) ? <LogedInMenu token ={props.token} setToken={props.setToken}/> : <React.Fragment></React.Fragment>);
};
 
