import React, {useMemo} from 'react'
import regeneratorRuntime from "regenerator-runtime";
import {useTable, useSortBy, useRowSelect, useFilters, usePagination} from 'react-table'
import {COLUMNS} from './columns'
import '../../StyleSheets/table.css'
//import { Checkbox} from './Checkbox'
import {ColumnFilter} from './ColumnFilter'


export const BasicTable = (props) =>{
    /*var navTo = (uri) =>{
        window.location.href = window.location.origin + uri;
    }*/

    const columns = useMemo(()=> COLUMNS,[])
    const data = useMemo(()=> props.data,[props]) /* use on instructors throuh props*/
    const defaultColumn = useMemo(()=> {
        return{
                Filter: ColumnFilter
            }
            },[])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        state,
        prepareRow
        //selectedFlatRows
        } = useTable({
            columns: columns,
            data: data,
            integrateSite: props.integrateSite,
            defaultColumn: defaultColumn
        },
        useFilters,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks)=>{
            hooks.visibleColumns.push((columns)=>{
                return [
                    ...columns
                ]
            })

        }
    )

    const {pageIndex} = state

    /*useEffect(() => {
        const x = selectedFlatRows.map((row)=>row.original)    
        if (x.length === 0) {
        }
        else{
            const y = x[0];
            //navTo(`/students/${y.id}`)
            this.props.history.push(`/students/${y.id}`);
        }
    })*/

    return(
        <div key ={props.data}>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? "▼": "▲"): ''}
                                        </span>
                                    </th>
                                ))
                            }
                            
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map((cell) => {
                                            return <td  {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }

                </tbody>

            </table>
            <div id='prevnext'>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex +1} of {pageOptions.length}
                    </strong> {' '}
                </span>
                <span>
                    | Go to page: {' '}
                    <input type='number' defaultValue={pageIndex + 1}
                    onChange={e => {
                        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(pageNumber)
                    }}
                    style = {{width: '50px'}}/>
                </span>
                <button onClick = {()=> gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                <button onClick = {()=> previousPage()} disabled={!canPreviousPage}>Previous</button>
                <button onClick = {()=> nextPage()} disabled={!canNextPage}>Next</button>
                <button onClick = {()=> gotoPage(pageCount-1)} disabled={!canNextPage}>{'>>'}</button>
            </div>
        </div>
    )
} 