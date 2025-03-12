import '../App.css';
import React, {useState, useEffect, useRef} from 'react';
import queries from '../config/queries'
import Dropdown from './Dropdown';
import Loader from './Loader';
import dbInteractions from '../services/dbInteractions.js';
import MultiDropdown from './MultiDropdown.js';
import Table from './Table.js';
import TextCheckbox from './TextCheckbox.js'
import {ReactComponent as Refresh} from '../assets/images/refresh.svg'
import {ReactComponent as CopyExcel} from '../assets/images/copyExcel.svg'
import brandingPalette from '../config/brandingPalette.js';
import queryUtils from '../utils/queryUtils.js';
import statisticsUtils from '../utils/statisticsUtils';
import './Statistics.css'

function Statistics(props) {
    const childColumnsRef = useRef();
    const childFilterRef = useRef();
    const childGroupBy1Ref = useRef();
    const childGroupBy2Ref = useRef();
    const childTableRef = useRef()
    const childGroupy1DateSettingRef = useRef();
    const childGroupy2DateSettingRef = useRef();
    const childGroupy1AscendingSettingRef = useRef();
    const childGroupy2AscendingSettingRef = useRef();

    const [groupBy1DateSetting,setGroupBy1DateSetting] = useState('day');
    const [groupBy2DateSetting,setGroupBy2DateSetting] = useState('day');
    const [groupBy1AscendingSetting,setGroupBy1AscendingSetting] = useState('asc');
    const [groupBy2AscendingSetting,setGroupBy2AscendingSetting] = useState('asc');
    const [table, setTable] = useState('visits');
    const [tables, setTables] = useState([]);
    const [columnsAvailable, setColumnsAvailable] = useState([]);
    const [columnsAvailableData, setColumnsAvailableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [records, setRecords] = useState([]);
    // const [tables, setTables] = useState(['visits','exports']);
    // const [columnsAvailable, setColumnsAvailable] = useState(['id', 'user_id', 'activity_id', 'color', 'filter', 'image', 'mode', 'size', 'unit', 'type', 'show_average', 'show_coordinates', 'show_date', 'show_distance', 'show_duration', 'show_elevation', 'show_power', 'show_name', 'timestamp', 'timestamp_local', 'timezone_offset', 'timezone_name', 'resolution']);
    // const [columnsAvailableData, setColumnsAvailableData] = useState({"id": {"column_name": "id","data_type": "integer","is_nullable": "NO","character_maximum_length": null},"user_id": {"column_name": "user_id","data_type": "integer","is_nullable": "YES","character_maximum_length": null},"activity_id": {"column_name": "activity_id","data_type": "integer","is_nullable": "YES","character_maximum_length": null},"color": {"column_name": "color","data_type": "character varying","is_nullable": "YES","character_maximum_length": 255},"filter": {"column_name": "filter","data_type": "integer","is_nullable": "YES","character_maximum_length": null},"image": {"column_name": "image","data_type": "character varying","is_nullable": "YES","character_maximum_length": 255},"mode": {"column_name": "mode","data_type": "character varying","is_nullable": "YES","character_maximum_length": 255},"size": {"column_name": "size","data_type": "character varying","is_nullable": "YES","character_maximum_length": 255},"unit": {"column_name": "unit","data_type": "character varying","is_nullable": "YES","character_maximum_length": 255},"type": {"column_name": "type","data_type": "character varying","is_nullable": "YES","character_maximum_length": 255},"show_average": {"column_name": "show_average","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"show_coordinates": {"column_name": "show_coordinates","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"show_date": {"column_name": "show_date","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"show_distance": {"column_name": "show_distance","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"show_duration": {"column_name": "show_duration","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"show_elevation": {"column_name": "show_elevation","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"show_power": {"column_name": "show_power","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"show_name": {"column_name": "show_name","data_type": "boolean","is_nullable": "YES","character_maximum_length": null},"timestamp": {"column_name": "timestamp","data_type": "timestamp without time zone","is_nullable": "YES","character_maximum_length": null},"timestamp_local": {"column_name": "timestamp_local","data_type": "timestamp without time zone","is_nullable": "YES","character_maximum_length": null},"timezone_offset": {"column_name": "timezone_offset","data_type": "character varying","is_nullable": "YES","character_maximum_length": 20},"timezone_name": {"column_name": "timezone_name","data_type": "character varying","is_nullable": "YES","character_maximum_length": 100},"resolution": {"column_name": "resolution","data_type": "integer","is_nullable": "YES","character_maximum_length": null}});
    // const [columns, setColumns] = useState(["id","user_id","type_export","timestamp","timestamp_local","timezone_name"]);
    // const [tableColumns, setTableColumns] = useState(["id","user_id","type_export","timestamp","timestamp_local","timezone_name"]);
    // const [records, setRecords] = useState([{"id": 9,"user_id": 2,"type_export": "contour","timestamp": "2025-01-17T00:53:40.393Z","timestamp_local": "2025-01-17T00:53:40.393Z","timezone_name": "Europe/Rome"},{"id": 10,"user_id": 2,"type_export": "contour","timestamp": "2025-01-17T00:53:40.393Z","timestamp_local": "2025-01-17T00:53:40.393Z","timezone_name": "Asia/Bangkok"},{"id": 11,"user_id": 2,"type_export": "contour","timestamp": "2025-01-17T00:53:40.393Z","timestamp_local": "2025-01-17T00:53:40.393Z","timezone_name": "Asia/Bangkok"},{"id": 12,"user_id": 2,"type_export": "contour","timestamp": "2024-11-27T23:53:40.393Z","timestamp_local": "2024-11-27T00:53:40.393Z","timezone_name": "Asia/Bangkok"},{"id": 13,"user_id": 2,"type_export": "contour","timestamp": "2024-11-27T23:53:40.393Z","timestamp_local": "2024-11-27T00:53:40.393Z","timezone_name": "Asia/Bangkok"},{"id": 1,"user_id": 2,"type_export": "contour","timestamp": "2024-11-26T23:53:40.393Z","timestamp_local": "2024-11-27T00:53:40.393Z","timezone_name": "Europe/Rome"},{"id": 2,"user_id": null,"type_export": "contour","timestamp": "2024-11-27T00:00:08.227Z","timestamp_local": "2024-11-27T01:00:08.227Z","timezone_name": "Europe/Rome",},{"id": 3,"user_id": null,"type_export": "contour","timestamp": "2024-11-27T00:01:29.747Z","timestamp_local": "2024-11-27T01:01:29.747Z","timezone_name": "Europe/Rome",},{"id": 4,"user_id": 2,"type_export": "complete","timestamp": "2024-11-27T00:04:36.140Z","timestamp_local": "2024-11-27T01:04:36.140Z","timezone_name": "Europe/Rome",},{"id": 5,"user_id": null,"type_export": "contour","timestamp": "2024-11-27T00:05:30.276Z","timestamp_local": "2024-11-27T01:05:30.277Z","timezone_name": "Europe/Rome",},{"id": 6,"user_id": null,"type_export": "contour","timestamp": "2024-11-27T00:36:31.004Z","timestamp_local": "2024-11-27T01:36:31.004Z","timezone_name": "Europe/Rome",},{"id": 7,"user_id": 2,"type_export": "contour","timestamp": "2024-12-15T09:06:14.732Z","timestamp_local": "2024-12-15T13:06:14.732Z","timezone_name": "Asia/Dubai",},{"id": 8,"user_id": null,"type_export": "contour","timestamp": "2024-12-15T21:34:35.145Z","timestamp_local": "2024-12-16T04:34:35.145Z","timezone_name": "Asia/Bangkok",}]);
    const [isLoading, setIsLoading] = useState(false);
    const [numberRecords, setNumberRecords] = useState(undefined);
    const [numberVisits, setNumberVisits] = useState(undefined);
    const [numberUsers, setNumberUsers] = useState(undefined);
    const [numberExports, setNumberExports] = useState(undefined);
    const [numberActivities, setNumberActivities] = useState(undefined);
    const [columnFilter, setColumnFilter] = useState(undefined);
    const [valueMinorFilter, setValueMinorFilter] = useState(undefined);
    const [valueMajorFilter, setValueMajorFilter] = useState(undefined);
    const [valueGroupBy1, setValueGroupBy1] = useState(undefined);
    const [settingGroupBy1, setSettingGroupBy1] = useState({isTimestamp: false, timestamp: undefined, ascending: true});
    const [valueGroupBy2, setValueGroupBy2] = useState(undefined);
    const [settingGroupBy2, setSettingGroupBy2] = useState({isTimestamp: false, timestamp: undefined, ascending: true});
    const [refreshed, setRefreshed] = useState(true)

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
            childGroupBy1Ref.current.resetSelect();
            setSettingGroupBy1({isTimestamp: false, timestamp: undefined, ascending: true})
        }
    }
    const resetGroupBy2Child = () => {
        if(valueGroupBy2 && childGroupBy2Ref.current) {
            setValueGroupBy2(undefined)
            childGroupBy2Ref.current.resetSelect();
            setSettingGroupBy2({isTimestamp: false, timestamp: undefined, ascending: true})
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

    // const retrieveRecords = () => {
    //     dbInteractions.processQuery(`SELECT * FROM ${table} ORDER BY id`, process.env.REACT_APP_JWT_TOKEN).then(res => {
    //         console.log('res:',res)
    //         if(res.records) {
    //             setNumberRecords(res.records.length)
    //             setRecords(res.records)
    //         }
    //     }).catch(e => {
    //         console.error('error querying tables:', e)
    //     })
    // }
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
            childColumnsRef.current.resetSelect();
        }
        resetFilterChild()
        resetGroupBy1Child()
        resetGroupBy2Child()
        setRecords([])
        retrieveColumns(data.value)
        setNumberRecords(undefined)
        setRefreshed(false)
        if(childTableRef.current) childTableRef.current.setRefreshNeeded()
        // setIsLoading(true)
    }

    const defineColumn = (data) => {
        console.log('valuesSelected:', data.valuesSelected)
        if(childTableRef.current) childTableRef.current.setRefreshNeeded()
        setColumns(data.valuesSelected)
    }
    const defineFilter = (data) => {
        console.log('valuesSelected:', data.value)
        if(childTableRef.current) childTableRef.current.setRefreshNeeded()
        if(data.value === columnFilter) resetFilterChild()
        else setColumnFilter(data.value)
    }
    const defineGroupBy1 = (data) => {
        console.log('valuesSelected:', data.value)
        console.log('columnsAvailable[data.value].data_type.startsWith(\'timestamp\')d:', columnsAvailableData[data.value].data_type.startsWith('timestamp'))
        if(data.value === valueGroupBy1) {
            launchRefreshLight()
            resetGroupBy1Child()
        } else {
            let set1 = columnsAvailableData[data.value].data_type.startsWith('timestamp') ? {isTimestamp: true, timestamp: 'day', ascending: true} : {isTimestamp: false, timestamp: undefined, ascending: true}
            launchRefreshLight(false,set1)
            setValueGroupBy1(data.value)
            setSettingGroupBy1(set1)
        }
        if(valueGroupBy2) resetGroupBy2Child()
        if(childTableRef.current) childTableRef.current.resetGroupedData()
    }
    const defineGroupBy2 = (data) => {
        console.log('valuesSelected:', data.value)
        if(data.value === valueGroupBy2) {
            launchRefreshLight(valueGroupBy1,settingGroupBy1,undefined,undefined)
            resetGroupBy2Child(columnsAvailableData[data.value].data_type.startsWith('timestamp'))
        } else {
            let set2 = columnsAvailableData[data.value].data_type.startsWith('timestamp') ? {isTimestamp: true, timestamp: 'day', ascending: true} : {isTimestamp: false, timestamp: undefined, ascending: true}
            launchRefreshLight(valueGroupBy1,settingGroupBy1,data.value,set2)
            setValueGroupBy2(data.value)
            setSettingGroupBy2(set2)
        }
        if(childTableRef.current) childTableRef.current.resetGroupedData()
    }

    const refreshStyle = {
        fill: brandingPalette.primary,
        transform: 'scale(0.6)'
    }

    const processRecords = (rawData) => {
        let result = []
        console.log('columnsAvailableData:', columnsAvailableData)
        for(let i in rawData) {
            let record = []
            for(let n in rawData[i]) {
                let valueDisplayed = rawData[i][n] !== null ? String(rawData[i][n]) : rawData[i][n]
                console.log('n', n)
                console.log('columnsAvailableData[n]', columnsAvailableData[n])
                if(columnsAvailableData[n] && columnsAvailableData[n].data_type.startsWith('timestamp')) valueDisplayed = statisticsUtils.getFormattedDateTime(valueDisplayed)
                record.push({
                    name: n,
                    label: n,
                    value: rawData[i][n],
                    valueDisplayed: valueDisplayed,
                    type: columnsAvailableData[n].data_type
                })
            }
            result.push(record)
        }
        return result
    }
    const launchRefreshLight = (upperValue1,settingValue1,upperValue2,settingValue2) => {
        if(childTableRef.current) childTableRef.current.resetTable(tableColumns, records, upperValue1, settingValue1, upperValue2, settingValue2)
    }

    const launchRefresh = () => {
        let processedRecords = records
        let processingColumns = columns
        console.log('processedRecords', processedRecords)
        if(processedRecords.length && !Array.isArray(processedRecords[0])) processedRecords = processRecords(records)
        setRecords(processedRecords)
        if(childTableRef.current) childTableRef.current.resetTable(columns, processedRecords, valueGroupBy1, settingGroupBy1, valueGroupBy2, settingGroupBy2)
        if(!processingColumns.length) {
            if(childColumnsRef.current) childColumnsRef.current.selectAll()
            processingColumns = columnsAvailable
            setColumns(columnsAvailable)
        }
        let query = queryUtils.getQuerySelectFieldsWithFilter(table,columns,columnFilter,valueMinorFilter,valueMajorFilter,columnsAvailableData,valueGroupBy1,valueGroupBy2)
        dbInteractions.processQuery(query, process.env.REACT_APP_JWT_TOKEN).then(res => {
            console.log('res:', res)
            let unprocessedRecords = res.records
            let processedRecords = processRecords(unprocessedRecords)
            console.log('processedRecords:',processedRecords)
            if(res.records) {
                setNumberRecords(res.records.length)
                setRecords(processedRecords)
            }
            // let tempTableColumns = [...columns]
            console.log('settingValue1', settingGroupBy1)
            console.log('settingValue2', settingGroupBy2)
            setTableColumns(processingColumns)
            setRefreshed(true)
            if(childTableRef.current) childTableRef.current.resetTable(processingColumns, processedRecords, valueGroupBy1, settingGroupBy1, valueGroupBy2, settingGroupBy2)
        }).catch(e => {
        console.error('error querying columns:', e)
      })
    }

    const onChangeMinor = (event) => {
        console.log(event.target.value)
        setValueMinorFilter(event.target.value)
        if(childTableRef.current) childTableRef.current.setRefreshNeeded()
    }

    const onChangeMajor = (event) => {
        console.log(event.target.value)
        setValueMajorFilter(event.target.value)
        if(childTableRef.current) childTableRef.current.setRefreshNeeded()
    }

    // const setGroupBy1SettingHelper = (timestamp,ascending) => {
    //     console.log('timestamp', timestamp)
    //     let jsonSeting = {
    //         isTimestamp : timestamp ? true : false,
    //         timestamp : settingGroupBy1.timestamp,
    //         ascending : ascending !== undefined ? ascending : settingGroupBy1.ascending
    //     }
    //     launchRefreshLight(valueGroupBy1,jsonSeting)
    //     setSettingGroupBy1(jsonSeting)
    // }
    // const setGroupBy2SettingHelper = (timestamp,ascending) => {
    //     let jsonSeting = {
    //         isTimestamp : timestamp ? true : false,
    //         timestamp : settingGroupBy2.timestamp,
    //         ascending : ascending !== undefined ? ascending : settingGroupBy2.ascending
    //     }
    //     launchRefreshLight(valueGroupBy1,settingGroupBy1,valueGroupBy2,jsonSeting)
    //     setSettingGroupBy2(jsonSeting)
    // }

    const defineGroupBy1DateSetting = (event) => {
        console.log(event.value)
        let jsonSeting = {
            isTimestamp : settingGroupBy2.isTimestamp,
            timestamp : settingGroupBy2.isTimestamp ? event.value : undefined,
            ascending : settingGroupBy2.ascending
        }
        setGroupBy1DateSetting(event.value)
        launchRefreshLight(valueGroupBy1,settingGroupBy1,valueGroupBy2,jsonSeting)
        setSettingGroupBy2(jsonSeting)
    }

    const defineGroupBy2DateSetting = (event) => {
        console.log(event.value)
        let jsonSeting = {
            isTimestamp : settingGroupBy2.isTimestamp,
            timestamp : settingGroupBy2.isTimestamp ? event.value : undefined,
            ascending : settingGroupBy2.ascending
        }
        setGroupBy2DateSetting(event.value)
        launchRefreshLight(valueGroupBy1,settingGroupBy1,valueGroupBy2,jsonSeting)
        setSettingGroupBy2(jsonSeting)
    }

    const defineGroupBy1AcendingSetting = (event) => {
        console.log(event.value)
        let jsonSeting = {
            isTimestamp : settingGroupBy1.isTimestamp,
            timestamp : settingGroupBy1.timestamp,
            ascending : event.value === 'asc'
        }
        setGroupBy1AscendingSetting(event.value === 'asc')
        launchRefreshLight(valueGroupBy1,jsonSeting,valueGroupBy2,settingGroupBy2)
        setSettingGroupBy2(jsonSeting)
    }

    const defineGroupBy2AcendingSetting = (event) => {
        console.log(event.value)
        let jsonSeting = {
            isTimestamp : settingGroupBy2.isTimestamp,
            timestamp : settingGroupBy2.timestamp,
            ascending : event.value === 'asc'
        }
        setGroupBy2AscendingSetting(event.value === 'asc')
        launchRefreshLight(valueGroupBy1,settingGroupBy1,valueGroupBy2,jsonSeting)
        setSettingGroupBy2(jsonSeting)
    }

    const copyTableToClipboard = () => {
        let table = document.querySelector("#statsTable");
        let text = "";
        console.log('table:', table)
        console.log('table.rows:', table.rows)
    
        for (let row of table.rows) {
            let rowData = [];
            for (let cell of row.cells) {
                rowData.push(cell.innerText);
            }
            text += rowData.join("\t") + "\n";
        }
    
        navigator.clipboard.writeText(text).then(() => {
            console.error("Table copied!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    }

    useEffect(() => {
        retrieveTables()
        retrieveColumns('visits')
        if(!numberVisits) retrieveNumbers()
    },[
        numberVisits
    ])

    return (<div className="wrapper-statistics">
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
                        <Dropdown ref={childGroupBy1Ref} value={valueGroupBy1} values={columnsAvailable} type="groupBy" hasBorder="true" size="300px" possibilityDeselect="true" handleChangeValue={defineGroupBy1}/>
                        {valueGroupBy1 && <div className="margin-dropdown">
                            <Dropdown ref={childGroupBy2Ref} value={valueGroupBy2} values={columnsAvailable} type="groupBy" hasBorder="true" size="300px" possibilityDeselect="true" handleChangeValue={defineGroupBy2}/>
                        </div>}
                    </div>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <div className="filter-wrapper">
                        <p className="p-back align-left invisible-null">NULL</p>
                        <TextCheckbox ref={childGroupy1AscendingSettingRef} value={groupBy1AscendingSetting} values={['asc','desc']} type="groupByAcendingSetting" hasBorder="true" size="110px" handleChangeValue={defineGroupBy1AcendingSetting}/>
                        {valueGroupBy1 && <div className="margin-dropdown">
                            <TextCheckbox ref={childGroupy2AscendingSettingRef} value={groupBy2AscendingSetting} values={['asc','desc']} type="groupByAcendingSetting" hasBorder="true" size="110px" handleChangeValue={defineGroupBy2AcendingSetting}/>
                        </div>}
                    </div>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <div className="filter-wrapper">
                        <p className="p-back align-left invisible-null">NULL</p>
                        {settingGroupBy1.isTimestamp && <Dropdown ref={childGroupy1DateSettingRef} value={groupBy1DateSetting} values={['day','month','year']} type="groupByDateSetting" hasBorder="true" size="110px" handleChangeValue={defineGroupBy1DateSetting}/>}
                        {valueGroupBy1 && settingGroupBy2.isTimestamp && <div className="margin-dropdown">
                            <Dropdown ref={childGroupy2DateSettingRef} value={groupBy2DateSetting} values={['day','month','year']} type="groupByDateSetting" hasBorder="true" size="110px" handleChangeValue={defineGroupBy2DateSetting}/>
                        </div>}
                    </div>
                </div>
                <div className="wrapper-refresh">
                    <Refresh style={refreshStyle} onClick={() => launchRefresh()}/>
                    <CopyExcel style={refreshStyle} onClick={() => copyTableToClipboard()}/>
                </div>
                <div className="wrapper-margin-dropdown-statistics">
                    <p className="p-back margin-top-29">{numberRecords}</p>
                </div>
            </div>
            {refreshed && <div><Table ref={childTableRef}/></div>}
        </div>}
    </div>)
}

export default Statistics