import React from 'react'
//import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
//import {useAuth0} from '@auth0/auth0-react';
import {ManagerMenu} from './ManagerMenu' 
import { useJwt } from "react-jwt";


export const ManagerMenuAuth = (props) =>{
    let { decodedToken, isExpired } = useJwt(props.token);
    
    let isAuthenticatedManager = false;

    if (typeof decodedToken !== 'undefined' && decodedToken !== null){
        if (
          decodedToken.user_claims.is_integration_engineer === false &&
          decodedToken.user_claims.is_audit === false &&
          decodedToken.user_claims.is_manager === true &&
          decodedToken.user_claims.is_admin === false &&
          decodedToken.user_claims.is_super_user === false
        ) {
          isAuthenticatedManager = true;
          sessionStorage.setItem("user_id", decodedToken.user_claims.user_id);
        } else {
          isAuthenticatedManager = false;
        }
    }else{
        isAuthenticatedManager = false
    }

    return isAuthenticatedManager ? (
      <ManagerMenu user_id={decodedToken.user_claims.user_id} />
    ) : (
      <React.Fragment></React.Fragment>
    );
}