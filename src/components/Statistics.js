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
    const childGroupBy1Ref = useRef();
    const childGroupBy2Ref = useRef();
    const childTableRef = useRef()

    const [tables, setTables] = useState([]);
    // const [tables, setTables] = useState(['visits','activities']);
    const [table, setTable] = useState('visits');
    const [columnsAvailable, setColumnsAvailable] = useState([]);
    const [columnsAvailableData, setColumnsAvailableData] = useState([]);
    // const [columnsAvailable, setColumnsAvailable] = useState(['visits','activities']);
    const [columns, setColumns] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [numberRecords, setNumberRecords] = useState(undefined);
    const [records, setRecords] = useState([]);
    const [numberVisits, setNumberVisits] = useState(undefined);
    const [numberUsers, setNumberUsers] = useState(undefined);
    const [numberExports, setNumberExports] = useState(undefined);
    const [numberActivities, setNumberActivities] = useState(undefined);
    const [columnFilter, setColumnFilter] = useState(undefined);
    const [valueMinorFilter, setValueMinorFilter] = useState(undefined);
    const [valueMajorFilter, setValueMajorFilter] = useState(undefined);
    const [valueGroupBy1, setValueGroupBy1] = useState(undefined);
    const [settingGroupBy1, setSettingGroupBy1] = useState({timestamp: 'day', ascending: true});
    const [valueGroupBy2, setValueGroupBy2] = useState(undefined);
    const [settingGroupBy2, setSettingGroupBy2] = useState({timestamp: 'day', ascending: true});
    const [refreshed, setRefreshed] = useState(false)

    const resetFilterChild = () => {
        if(columnFilter && childFilterRef.current) {
            setColumnFilter(undefined)
            setValueMinorFilter(undefined)
            setValueMajorFilter(undefined)
            childFilterRef.current.resetSelect(); // Call the function exposed by the child
        }
    }

    const resetGroupBy1Child = () => {
        if(valueGroupBy1 && childGroupBy1Ref.current) {
            setValueGroupBy1(undefined)
            setSettingGroupBy1({timestamp: 'day', ascending: true})
            childGroupBy1Ref.current.resetSelect();
        }
    }
    const resetGroupBy2Child = () => {
        if(valueGroupBy2 && childGroupBy2Ref.current) {
            setValueGroupBy2(undefined)
            setSettingGroupBy2({timestamp: 'day', ascending: true})
            childGroupBy2Ref.current.resetSelect();
        }
    }

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
            let columnsData = {}
            if(res.records.length) {
                res.records.forEach(e => {
                    console.log('column_name:', e.column_name)
                    console.log('e:', e)
                    columnArray.push(e.column_name)
                    columnsData[e.column_name] = e
                });
                setColumnsAvailable(columnArray)
                setColumnsAvailableData(columnsData)

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
        resetFilterChild()
        resetGroupBy1Child()
        resetGroupBy2Child()
        setRecords([])
        retrieveColumns(data.value)
        setNumberRecords(undefined)
        setRefreshed(false)
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
        if(data.value === columnFilter) resetFilterChild()
        else setColumnFilter(data.value)
    }
    const defineGroupBy1 = (data) => {
        console.log('valuesSelected:', data.value)
        if(data.value === valueGroupBy1) resetGroupBy1Child()
        else setValueGroupBy1(data.value)
    }
    const defineGroupBy2 = (data) => {
        console.log('valuesSelected:', data.value)
        if(data.value === valueGroupBy2) resetGroupBy2Child()
        else setValueGroupBy2(data.value)
    }

    const refreshStyle = {
        fill: brandingPalette.primary,
        transform: 'scale(0.6)'
    }

    const launchRefresh = () => {
        let query = queryUtils.getQuerySelectFieldsWithFilter(table,columns,columnFilter,valueMinorFilter,valueMajorFilter,columnsAvailableData,valueGroupBy1,valueGroupBy2)
        dbInteractions.processQuery(query, process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:', res)
            if(res.records) {
                setNumberRecords(res.records.length)
                setRecords(res.records)
            }
            let tempTableColumns = [...columns]
            if(!columns.includes(valueGroupBy1)) tempTableColumns.push(valueGroupBy1)
            if(!columns.includes(valueGroupBy2)) tempTableColumns.push(valueGroupBy2)
            setTableColumns(tempTableColumns)
            setRefreshed(true)
            if(childTableRef.current) childTableRef.current.setRefreshNeeded()
        }).catch(e => {
        console.error('error querying columns:', e)
      })
    }

    const onChangeMinor = (event) => {
        console.log(event.target.value)
        setValueMinorFilter(event.target.value)
    }

    const onChangeMajor = (event) => {
        console.log(event.target.value)
        setValueMajorFilter(event.target.value)
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
                    <p className="p-back align-left">TABLE</p>
                    <Dropdown value={table} values={tables} type="table" hasBorder="true" handleChangeValue={defineTable}/>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <p className="p-back align-left">COLUMNS</p>
                    <MultiDropdown ref={childColumnsRef} valuesSelected={columns} valuesAvailable={columnsAvailable} type="column" hasBorder="true" size="300px" handleChangeValue={defineColumn}/>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <div className="filter-wrapper">
                        <p className="p-back align-left">FILTER</p>
                        <Dropdown ref={childFilterRef} value={columnFilter} values={columnsAvailable} type="filter" hasBorder="true" size="300px" possibilityDeselect="true" handleChangeValue={defineFilter}/>
                        <div className="filter-wrapper-constrains">
                            <input type="text" value={valueMinorFilter} className="input-constrain p-back minor-input" placeholder="Min. cons." onChange={onChangeMinor}/>
                            <input type="text" value={valueMajorFilter} className="input-constrain p-back major-input" placeholder="Maj. cons." onChange={onChangeMajor}/>
                        </div>
                    </div>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <div className="filter-wrapper">
                        <p className="p-back align-left">GROUP BY</p>
                        <Dropdown ref={childGroupBy1Ref} value={valueGroupBy1} values={columnsAvailable} type="groupBy1" hasBorder="true" size="300px" possibilityDeselect="true" handleChangeValue={defineGroupBy1}/>
                        {valueGroupBy1 && <div className="margin-dropdown">
                            <Dropdown ref={childGroupBy2Ref} value={valueGroupBy2} values={columnsAvailable} type="groupBy2" hasBorder="true" size="300px" possibilityDeselect="true" handleChangeValue={defineGroupBy2}/>
                        </div>}
                    </div>
                </div>
                <div className="wrapper-refresh" onClick={() => launchRefresh()}>
                    <Refresh style={refreshStyle}/>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <p className="p-back">{numberRecords}</p>
                </div>
            </div>
            <div>
                <table className='table-statistics'>
                    <thead className='header-table-statistics'>
                        <tr className='row-table'>
                            <th className="cell-table">h1</th>
                            <th className="cell-table">h2</th>
                            <th className="cell-table">h3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='row-table'>
                            <td className="cell-table">1</td>
                            <td className="cell-table">
                                <tr>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                </tr>
                                <tr>
                                    <td>F</td>
                                </tr>
                            </td>
                            <td>
                                <tr>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                </tr>
                            </td>
                        </tr>
                        <tr className='row-table'>
                            <td className="cell-table">1</td>
                            <td className="cell-table">
                                <tr>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                </tr>
                                <tr>
                                    <td>F</td>
                                </tr>
                            </td>
                            <td className="cell-table">
                                <tr>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                </tr>
                                <tr>
                                    <td>F</td>
                                </tr>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {refreshed && <div><Table ref={childTableRef} columns={tableColumns} columnsData={columnsAvailableData} records={records} valueGroupBy1={valueGroupBy1} valueGroupBy2={valueGroupBy2} settingGroupBy1={settingGroupBy1} settingGroupBy2={settingGroupBy2}/></div>}
        </div>}
    </div>)
}

export default Statistics