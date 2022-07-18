import React from 'react'
//import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
//import {useAuth0} from '@auth0/auth0-react';
import {AdminMenu} from './AdminMenu' 
import { useJwt } from "react-jwt";


export const AdminMenuAuth = (props) =>{
    let { decodedToken, isExpired } = useJwt(props.token);
    
    let isAuthenticatedAdmin = false;

    if (typeof decodedToken !== 'undefined' && decodedToken !== null){
        if (
          decodedToken.user_claims.is_integration_engineer === false &&
          decodedToken.user_claims.is_audit === false &&
          decodedToken.user_claims.is_manager === false &&
          decodedToken.user_claims.is_admin === true &&
          decodedToken.user_claims.is_super_user === false
        ){
            isAuthenticatedAdmin = true;
            sessionStorage.setItem("user_id", decodedToken.user_claims.user_id);
        }
        else{
            isAuthenticatedAdmin = false
        }
    }else{
        isAuthenticatedAdmin = false
    }

    // return (isAuthenticatedAdmin ? <AdminMenu user_id={decodedToken.user_id} /> :<React.Fragment></React.Fragment>);
    console.log("In AdminMenuAuth.js, isAuthenticatedAdmin");
    console.log(isAuthenticatedAdmin);
    return isAuthenticatedAdmin ? (
      <AdminMenu user_id={decodedToken.user_claims.user_id} />
    ) : (
      <React.Fragment></React.Fragment>
    );
}