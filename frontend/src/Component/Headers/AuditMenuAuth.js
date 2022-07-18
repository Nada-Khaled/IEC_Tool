import React from 'react'
//import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
//import {useAuth0} from '@auth0/auth0-react';
import {AuditMenu} from './AuditMenu';
import { useJwt } from "react-jwt";


export const AuditMenuAuth = (props) =>{
    let { decodedToken, isExpired } = useJwt(props.token);
    
    let isAuthenticatedAudit = false;

    if (typeof decodedToken !== 'undefined' && decodedToken !== null){
        if (
          decodedToken.user_claims.is_integration_engineer === false &&
          decodedToken.user_claims.is_audit === true &&
          decodedToken.user_claims.is_manager === false &&
          decodedToken.user_claims.is_admin === false &&
          decodedToken.user_claims.is_super_user === false
        ) {
          isAuthenticatedAudit = true;
          sessionStorage.setItem("user_id", decodedToken.user_claims.user_id);
        } else {
          isAuthenticatedAudit = false;
        }
    }else{
        isAuthenticatedAudit = false
    }

    return isAuthenticatedAudit ? (
      <AuditMenu user_id={decodedToken.user_claims.user_id} />
    ) : (
      <React.Fragment></React.Fragment>
    );
}