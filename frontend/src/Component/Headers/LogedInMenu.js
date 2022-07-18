import React from 'react';
import '../../StyleSheets/Header.css';
import {IntegrationEngineerMenuAuth} from './IntegrationEngineerMenuAuth' //done
import {AuditMenuAuth} from './AuditMenuAuth';
import {ManagerMenuAuth} from './ManagerMenuAuth';
import { AdminMenuAuth } from './AdminMenuAuth'; //done
import {SuperUserMenuAuth} from './SuperUserMenuAuth';

export const LogedInMenu = (props) =>{

    console.log("In LogedInMenu, props.token")
    console.log(props.token)
            
    return(
        <React.Fragment>
            <IntegrationEngineerMenuAuth token ={props.token}/>
            <AuditMenuAuth token ={props.token}/>
            <ManagerMenuAuth token ={props.token}/>
            <AdminMenuAuth token ={props.token}/>
            <SuperUserMenuAuth token ={props.token}/>
        </React.Fragment>
    )
}