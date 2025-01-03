import '../App.css';
import React, {useState, useEffect} from 'react';
import queries from '../config/queries'
import Dropdown from './Dropdown';
import Loader from './Loader';
import dbInteractions from '../services/dbInteractions.js';
import MultiDropdown from './MultiDropdown.js';

function Statistics(props) {

    const [tables, setTables] = useState(['visits','activities']);
    const [table, setTable] = useState(undefined);
    const [columnsAvailable, setColumnsAvailable] = useState(['visits','activities']);
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [numberRecords, setNumberRecords] = useState(0);
    const [records, setRecords] = useState([]);

    const retrieveTables = () => {
        dbInteractions.processQuery(queries.tables, process.env.REACT_APP_JWT_TOKEN).then(res => {
            let tableArray = []
            if(res.records.length) {
                res.records.forEach(e => {
                    console.log('table:', e.tablename)
                    tableArray.push(e.tablename)
                });
                setTables(tableArray)
                setIsLoading(false)
            }
        }).catch(e => {
        console.error('error querying tables:', e)
      })
    }

    const retrieveRecords = () => {
        dbInteractions.processQuery(`SELECT * FROM ${table}`, process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:',res)
            if(res.records) {
                setNumberRecords(res.records.length)
                setRecords(res.records)
            }
        }).catch(e => {
        console.error('error querying tables:', e)
      })
    }

    const retrieveColumns = (nameTable) => {
        console.log('queries.getQueryColumns(table):', queries.getQueryColumns(nameTable))
        dbInteractions.processQuery(queries.getQueryColumns(nameTable), process.env.REACT_APP_JWT_TOKEN).then(res => {
            let columnArray = []
            if(res.records.length) {
                res.records.forEach(e => {
                    console.log('column_name:', e.column_name)
                    columnArray.push(e.column_name)
                });
                setColumns(columnArray)
                setIsLoading(false)
            }
        }).catch(e => {
        console.error('error querying columns:', e)
      })
    }

    const defineTable = (data) => {
        console.log('table:', data.value)
        setTable(data.value)
        retrieveColumns(data.value)
        retrieveRecords()
        // setIsLoading(true)
    }

    const defineColumn = (data) => {
        console.log('table:', table)
        // setTable(data.value)
        // setIsLoading(true)
    }

    useEffect(() => {
        retrieveTables()
    },[])

    return (<div>
        {isLoading && <Loader/>}
        {!isLoading && <div className="position-dropdown-statistics">
            <div className="wrapper-dropdown-statistics">
                <Dropdown value={table} values={tables} type="table" hasBorder="true" handleChangeValue={defineTable}/>
            </div>
            {table && <div className="wrapper-dropdown-statistics">
                <MultiDropdown valuesSelected={columns} valuesAvailable={columnsAvailable} type="column" hasBorder="true" handleChangeValue={defineColumn}/>
            </div>}
        </div>}
    </div>)
}

export default Statistics