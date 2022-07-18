import React from 'react'
//import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
//import {useAuth0} from '@auth0/auth0-react';
import {IntegrationEngineerMenu} from './IntegrationEngineerMenu' 
import { useJwt } from "react-jwt";


export const IntegrationEngineerMenuAuth = (props) =>{
    let { decodedToken, isExpired } = useJwt(props.token);
    
    let isAuthenticatedIntegrationEngineer = false;

    if (typeof decodedToken !== 'undefined' && decodedToken !== null){
        if (
          decodedToken.user_claims.is_integration_engineer === true &&
          decodedToken.user_claims.is_audit === false &&
          decodedToken.user_claims.is_manager === false &&
          decodedToken.user_claims.is_admin === false &&
          decodedToken.user_claims.is_super_user === false
        ) {
          isAuthenticatedIntegrationEngineer = true;
          sessionStorage.setItem("user_id", decodedToken.user_claims.user_id);
        } else {
          isAuthenticatedIntegrationEngineer = false;
        }
    }else{
        isAuthenticatedIntegrationEngineer = false
    }

    return isAuthenticatedIntegrationEngineer ? (
      <IntegrationEngineerMenu user_id={decodedToken.user_claims.user_id} />
    ) : (
      <React.Fragment></React.Fragment>
    );
}