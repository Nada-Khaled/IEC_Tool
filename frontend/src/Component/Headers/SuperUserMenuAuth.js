import React from 'react'
//import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
//import {useAuth0} from '@auth0/auth0-react';
import {SuperUserMenu} from './SuperUserMenu';
import { useJwt } from "react-jwt";


export const SuperUserMenuAuth = (props) =>{
    let { decodedToken, isExpired } = useJwt(props.token);

    console.log("In SuperUserMenuAuth, decodedToken:");
    console.log(decodedToken);

    let isAuthenticatedSuperUser = false;

    if (typeof decodedToken !== 'undefined' && decodedToken !== null){

        if (
          decodedToken.user_claims.is_integration_engineer === false &&
          decodedToken.user_claims.is_audit === false &&
          decodedToken.user_claims.is_manager === false &&
          decodedToken.user_claims.is_admin === false &&
          decodedToken.user_claims.is_super_user === true
        ) {
                console.log("decodedToken.user_claims");
                console.log(decodedToken.user_claims);
                console.log("decodedToken.user_claims.user_id");
                console.log(decodedToken.user_claims.user_id);
          isAuthenticatedSuperUser = true;
          sessionStorage.setItem("user_id", decodedToken.user_claims.user_id);
        } else {
          isAuthenticatedSuperUser = false;
        }
    }else{
        isAuthenticatedSuperUser = false
    }

      return isAuthenticatedSuperUser ? (
        <SuperUserMenu user_id={decodedToken.user_claims.user_id} />
      ) : (
        <React.Fragment></React.Fragment>
      );
}

