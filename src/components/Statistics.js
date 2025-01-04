import '../App.css';
import React, {useState, useEffect, useRef} from 'react';
import queries from '../config/queries'
import Dropdown from './Dropdown';
import Loader from './Loader';
import dbInteractions from '../services/dbInteractions.js';
import MultiDropdown from './MultiDropdown.js';
import Table from './Table.js';
import {ReactComponent as Refresh} from '../assets/images/refresh.svg'
import brandingPalette from '../config/brandingPalette.js';
import queryUtils from '../utils/queryUtils.js';

function Statistics(props) {
    const childColumnsRef = useRef();
    const childFilterRef = useRef();

    const [tables, setTables] = useState([]);
    // const [tables, setTables] = useState(['visits','activities']);
    const [table, setTable] = useState('visits');
    const [columnsAvailable, setColumnsAvailable] = useState([]);
    // const [columnsAvailable, setColumnsAvailable] = useState(['visits','activities']);
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [numberRecords, setNumberRecords] = useState(0);
    const [records, setRecords] = useState([]);
    const [numberVisits, setNumberVisits] = useState(undefined);
    const [numberUsers, setNumberUsers] = useState(undefined);
    const [numberExports, setNumberExports] = useState(undefined);
    const [numberActivities, setNumberActivities] = useState(undefined);
    const [columnFilter, setColumnFilter] = useState(undefined)

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
        dbInteractions.processQuery(`SELECT * FROM ${table} ORDER BY id`, process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:',res)
            if(res.records) {
                setNumberRecords(res.records.length)
                setRecords(res.records)
            }
        }).catch(e => {
            console.error('error querying tables:', e)
        })
    }
    const retrieveNumbers = () => {
        dbInteractions.processQuery(queries.getQueryCount('visits'), process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:',res)
            if(res.records) {
                setNumberVisits(res.records[0].count)
            }
        }).catch(e => {
            console.error('error querying number of visits:', e)
        })
        dbInteractions.processQuery(queries.getQueryCount('users'), process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:',res)
            if(res.records) {
                setNumberUsers(res.records[0].count)
            }
        }).catch(e => {
            console.error('error querying number of visits:', e)
        })
        dbInteractions.processQuery(queries.getQueryCount('activities'), process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:',res)
            if(res.records) {
                setNumberActivities(res.records[0].count)
            }
        }).catch(e => {
            console.error('error querying number of activities:', e)
        })
        dbInteractions.processQuery(queries.getQueryCount('exports'), process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:',res)
            if(res.records) {
                setNumberExports(res.records[0].count)
            }
        }).catch(e => {
            console.error('error querying number of exports:', e)
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
                setColumnsAvailable(columnArray)
                setIsLoading(false)
            }
        }).catch(e => {
            console.error('error querying columns:', e)
        })
    }

    const defineTable = (data) => {
        console.log('table:', data.value)
        setTable(data.value)
        if(columns.length && childColumnsRef.current) {
            setColumns([])
            childColumnsRef.current.resetSelect(); // Call the function exposed by the child
        }
        if(columnFilter && childFilterRef.current) {
            setColumnFilter(undefined)
            childFilterRef.current.resetSelect(); // Call the function exposed by the child
        }
        retrieveColumns(data.value)
        // setIsLoading(true)
    }

    const defineColumn = (data) => {
        console.log('valuesSelected:', data.valuesSelected)
        setColumns(data.valuesSelected)
        // setTable(data.value)
        // setIsLoading(true)
    }
    const defineFilter = (data) => {
        console.log('valuesSelected:', data.value)
        setColumnFilter(data.value)
    }

    const refreshStyle = {
        fill: brandingPalette.primary,
        transform: 'scale(0.6)'
    }

    const launchRefresh = () => {
        let query = queryUtils.getQuerySelectFieldsAll(table,columns,undefined)
        console.log('hey launching refresh of the data', query)
        dbInteractions.processQuery(query, process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:', res)
            if(res.records) {
                setNumberRecords(res.records.length)
                setRecords(res.records)
            }
        }).catch(e => {
        console.error('error querying columns:', e)
      })
    }

    useEffect(() => {
        retrieveTables()
        retrieveColumns('visits')
        if(!numberVisits) retrieveNumbers()
    },[numberVisits])

    return (<div className="statistics-wrapper">
        {isLoading &&  <div className="translate-loading">
            <Loader/>
        </div>}
        {!isLoading && <div className="wrapper-statistics">
            <div className="wrapper-numbers">
                <p className="p-back wrapper-margin-dropdown-statistics">VISITS: {numberVisits}</p>
                <p className="p-back wrapper-margin-dropdown-statistics">USERS: {numberUsers}</p>
                <p className="p-back wrapper-margin-dropdown-statistics">ACTIVITIES: {numberActivities}</p>
                <p className="p-back wrapper-margin-dropdown-statistics">EXPORTS: {numberExports}</p>
            </div>
            <div className="position-dropdown-statistics">
                <div className="wrapper-margin-dropdown-statistics">
                    <Dropdown value={table} values={tables} type="table" hasBorder="true" handleChangeValue={defineTable}/>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <MultiDropdown ref={childColumnsRef} valuesSelected={columns} valuesAvailable={columnsAvailable} type="column" hasBorder="true" size="300px" handleChangeValue={defineColumn}/>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <Dropdown ref={childFilterRef} value={columnFilter} values={columnsAvailable} type="filter" hasBorder="true" size="300px" handleChangeValue={defineFilter}/>
                </div>
                <div className="wrapper-refresh" onClick={() => launchRefresh()}>
                    <Refresh style={refreshStyle}/>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <p className="p-back">{numberRecords}</p>
                </div>
            </div>
            <div><Table columns={columns} records={records}/></div>
        </div>}
    </div>)
}

export default Statistics