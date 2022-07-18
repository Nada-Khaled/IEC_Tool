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
    width: "20",
    Header: () => "",
    accessor: "id",
    Cell: ({ value }) => (
      <Link to={`/status/${value}`}>
        <Button circular icon="edit" content="Edit" />
      </Link>
    ),
    disableFilters: true,
  },
  {
    Header: "Status",
    accessor: "name",
  }
];