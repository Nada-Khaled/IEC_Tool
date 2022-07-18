//import {format} from 'date-fns'
import React, { Component }  from 'react';
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

/*var navTo = (uri) =>{
    window.location.href = window.location.origin + uri;
}*/
//onClick={()=>navTo(`/projects/${value}`)}

export const COLUMNS = [
    {
        width:'20',
        Header:()=>'',
        accessor:'id',
        Cell:({value}) => (
            <Link to={`/projects/${value}`}><Button circular icon='edit' content='Edit'/></Link>
        ),
        disableFilters: true
    },
    {
        Header: 'Project Name',
        accessor: 'project_name'
    },
    {
        Header: 'Budget Year',
        accessor: 'budget_year'
    },
    {
        Header: 'Vendor',
        accessor: 'vendor.vendor_name'
    },
    {
        Header: 'Technologies',
        accessor: 'technology_text'
    },
    {
        Header: 'Does Target depends on Technologies?',
        accessor: 'is_target_technology_dependent'
    },
    {
        Header: 'Target',
        accessor: 'target'
    },
    {
        Header: 'Does Visit Price depends on Technologies?',
        accessor: 'is_visit_price_technology_dependent'
    },
    {
        Header: 'Visit Price',
        accessor: 'visit_price'
    }
]