//import {format} from 'date-fns'
import React, { Component }  from 'react';
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
//import history from './history';

//var navTo = (uri) =>{
    //window.location.href = window.location.origin + uri;
  //  history.push(uri)
//}

//onClick={()=>navTo(`/students/${value}`)}

export const COLUMNS = [
    {
        width:30,
        Header:()=>'',
        accessor:'id',
        Cell:({value}) => (
            <Link to={`/users/${value}`}><Button circular icon='edit' /></Link>
        ),
        disableFilters: true
    },
    {
        Header: 'Name',
        accessor: 'full_name'
    },
    {
        Header: 'Username',
        accessor: 'username'
    },
    {
        Header: 'Orange ID',
        accessor: 'orange_id'
    },
    {
        Header: 'Role',
        accessor: 'role'
    },
    {
        Header: 'Title',
        accessor: 'title'
    },
    {
        Header: 'E-Mail',
        accessor: 'email'
    },
    {
        Header: 'Phone Number',
        accessor: 'phone'
    }
]