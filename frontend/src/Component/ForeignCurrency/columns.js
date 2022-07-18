//import {format} from 'date-fns'
import React, { Component }  from 'react';
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'


export const COLUMNS = [
  {
    width: "20",
    Header: () => "",
    accessor: "id",
    Cell: ({ value }) => (
      <Link to={`/foreignCurrencies/${value}`}>
        <Button circular icon="edit" content="Edit" />
      </Link>
    ),
    disableFilters: true,
  },
  {
    Header: "Foreign Currency",
    accessor: "name",
  },
  {
    Header: "Rate to EGP",
    accessor: "rate_to_egp",
  },
];