import React from 'react'
import {useAsyncDebounce} from 'react-table'

export const ColumnFilter = ({column}) => {
    const {filterValue, setFilter} = column

 //   const [value, setValue] = useState(filter)
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 1000)
    
    return (
        <span>
            {''}
            <input value={filterValue ||''} 
            onChange={(e)=> {
                setFilter(e.target.value)
                onChange(e.target.value)
                }} />
        </span>
    )
}