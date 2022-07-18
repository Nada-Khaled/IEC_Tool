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
      <Link to={`/iec/${value}`}>
        <Button circular icon="edit" content="Edit" />
      </Link>
    ),
    disableFilters: true,
  },
  {
    Header: "Project Title",
    accessor: "project_title",
  },
  {
    Header: "Finance Number",
    accessor: "finance_number",
  },
  {
    Header: "Request Date",
    accessor: "request_date",
  },
  {
    Header: "Start Date",
    accessor: "start_date",
  },
  {
    Header: "IEC Date",
    accessor: "iec_date",
  },
  {
    Header: "Status",
    accessor: "status.name",
  },
  {
    Header: "Project Description",
    accessor: "project_description",
  },
  {
    Header: "Supply Chain Feedback",
    accessor: "supply_chain_feedback.name",
  },
  {
    Header: "Procurement Feedback",
    accessor: "procurement_feedback.name",
  },
  {
    Header: "Decision Support Feedback",
    accessor: "decision_support_feedback.name",
  },
  {
    Header: "Is Annual",
    accessor: "is_annual",
  },
  {
    Header: "Number of Year",
    accessor: "number_of_years",
  },
  {
    Header: "Opex",
    accessor: "opex_egp",
  },
  {
    Header: "Capex",
    accessor: "capex_egp",
  },
  {
    Header: "Total",
    accessor: "total",
  },
  {
    Header: "Comment",
    accessor: "comment",
  },
];