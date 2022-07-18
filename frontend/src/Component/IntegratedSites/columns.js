//import {format} from 'date-fns'
import React, { Component }  from 'react';
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import {format} from 'date-fns'

/*var navTo = (uri) =>{
    window.location.href = window.location.origin + uri;
}*/
//onClick={()=>navTo(`/areas/${value}`)}

// <Link to={`/integrated-sites/${props.row.values.id}`}></Link>

export const COLUMNS = [
    {
        width:'20',
        Header:()=>'',
        accessor:'id',
        Cell:(props) => {
            console.log(props);
            if (props.row.values.is_integrated == 'No'){
                return(
                    <div><Button circular icon='power' content='Integrate' onClick={()=> props.integrateSite(props.row.values.id)}/></div>
                );
            } else{
                return(
                    <div></div>
                );
            }
        },
        disableFilters: true
    },
    {
        Header: 'Site Name',
        accessor: 'site.site_name'
    },
    {
        Header: 'Site Code',
        accessor: 'site.site_code'
    }
    ,
    {
        Header: 'Version',
        accessor: 'site.version'
    },
    {
        Header: 'Area',
        accessor: 'site.area.area_code'
    },
    {
        Header: 'Vendor',
        accessor: 'site.vendor.vendor_name'
    },
    {
        Header: 'Technologies',
        accessor: 'site.technology_text'
    },
    {
        Header: 'Activity Type',
        accessor: 'site.activity_type'
    },
    {
        Header: 'Project',
        accessor: 'project.project_name'
    },
    {
        Header: 'Budget Year',
        accessor: 'project.budget_year'
    },
    {
        Header: 'Project Affected Technologies',
        accessor: 'technology_proj_text'
    },
    {
        Header: 'Status',
        accessor: 'status'
    },
    {
        Header: 'Accountability',
        accessor: 'accountability.text'
    },
    {
        Header: 'Target Month',
        accessor: 'target_month'
    },
    {
        Header: 'Target Year',
        accessor: 'target_year'
    },
    {
        Header: 'Is Integrated?',
        accessor: 'is_integrated'
    },
    {
        Header: 'Number of Visits',
        accessor: 'visits_number'
    },
    {
        Header: 'Total Price',
        accessor: 'total_price'
    },
    {
        Header: 'Integration Date',
        accessor: 'integration_date',
        Cell:({value}) =>{
            if (value === '')
                return value;
            else
                return format(new Date(value), 'dd/MM/yyyy');
        }
    },
    {
        Header: 'Is Signed?',
        accessor: 'is_signed'
    },
    {
        Header: 'PO',
        accessor: 'po_number'
    },
    {
        Header: 'Sign Date',
        accessor: 'sign_date',
        Cell:({value}) =>{
            if (value === '')
                return value;
            else
                return format(new Date(value), 'dd/MM/yyyy');
        }
    },
    {
        Header: 'Engineer (external)',
        accessor: 'user_added_external'
    },
    {
        Header: 'Engineer (Tool Adding)',
        accessor: 'user_added_orange'
    },
    {
        Header: 'Engineer (Tool Integration)',
        accessor: 'user_integrated'
    },
    {
        Header: 'Engineer (Tool Signing)',
        accessor: 'user_signed'
    }
]
