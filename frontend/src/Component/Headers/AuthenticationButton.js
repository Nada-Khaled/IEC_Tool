import React from "react";

import {LoginButton} from "./LoginButton";
import {LogoutButton} from "./LogoutButton";

//import { useAuth0 } from "@auth0/auth0-react";

export const AuthenticationButton = (props) => {
  return ((typeof props.token !== 'undefined' && props.token !== null) ? <LogoutButton token ={props.token} setToken={props.setToken}/> : <LoginButton token ={props.token} setToken={props.setToken}/>);
};
 
