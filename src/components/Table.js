import '../App.css';
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import statisticsUtils from '../utils/statisticsUtils';

const Table= forwardRef((props,ref) => {

    const {columns, columnsData, records, valueGroupBy1, valueGroupBy2, settingGroupBy1, settingGroupBy2} = props

    const [needsRefresh,setNeedsRefresh] = useState(false)

    const setRefreshNeeded = () => {
        if(needsRefresh) setNeedsRefresh(false)
    }

    useImperativeHandle(ref, () => ({
        setRefreshNeeded,
    }));

    const returnHeader = (arrayHeader) => {
        let header = []
        for(let element of arrayHeader) header.push(<th className="cell-table">{element}</th>)
        return <thead className="header-table-statistics"><tr className="row-table">{header}</tr></thead>
    }

    // const returnRow = (record, value)

    const returnBody = (arrayRecords) => {
        console.log('valueGroupBy1', valueGroupBy1)
        console.log('valueGroupBy2', valueGroupBy2)
        console.log('columnsData', columnsData)
        console.log('arrayRecords', arrayRecords)
        let rows = []
        for(let record of arrayRecords) {
            let row = []
            console.log('record:', record)
            for(let column in record) {
                console.log('column:', column)
                let value = record[column] !== null ? String(record[column]) : record[column]
                console.log('value:', value)
                if(columnsData[column].data_type.startsWith('timestamp')) value = statisticsUtils.getFormattedDateTime(value)
                row.push(<td className="cell-table">{value}</td>)
            }
            rows.push(<tr className="row-table">{row}</tr>)
        }
        return <tbody>{rows}</tbody>
    }

    const returnBodyGroupedBy1 = (arrayRecordsGrouped,columnsReordered) => {
        let rows = []
        console.log('arrayRecordsGrouped:', arrayRecordsGrouped)
        console.log('columnsReordered:', columnsReordered)
        for(let record of arrayRecordsGrouped) {
            let row = []
            row.push(<td className="cell-table">{record[0]}</td>)
            let transposedMatrix = record[1][0].map((_, colIndex) => record[1].map(row => row[colIndex]));
            // console.log('record:', record)
            for(let indexRowTransposed in transposedMatrix) {
                let rowTransposed = transposedMatrix[indexRowTransposed]
                let subRow = []
                // console.log('rowTransposed:', rowTransposed)
                for(let indexColumnTransposed in rowTransposed) {
                    let value = rowTransposed[indexColumnTransposed] !== null ? String(rowTransposed[indexColumnTransposed]) : 'null'
                    let classInvisibleCell = (rowTransposed[indexColumnTransposed]  !== null ? '' : ' invisible-null')
                    if(columnsData[columnsReordered[Number(indexRowTransposed) + 1]].data_type.startsWith('timestamp')) value = statisticsUtils.getFormattedDateTime(value)
                    // subRow.push()
                    // subTable.push()
                    subRow.push(<tr><td className={classInvisibleCell}>{value}</td></tr>)
                }
                row.push(<td className="cell-table">{subRow}</td>)
            }
            rows.push(<tr className="row-table">{row}</tr>)
        }
        return <tbody>{rows}</tbody>
    }

    const returnGroupedRecords = (arrayRecordsJson, indexValueGroupBy1) => {
        let arrayRecords = []
        console.log('arrayRecordsJson', arrayRecordsJson)
        for(let record of arrayRecordsJson) {
            let row = []
            for(let column in record) {
                console.log('column', column)
                console.log('record[column]', record[column])
                row.push(record[column])
            }
            arrayRecords.push(row)
        }

        let result = []
        console.log('arrayRecords', arrayRecords)
        console.log('indexValueGroupBy1', indexValueGroupBy1)
        console.log('columnsData', columnsData)
        console.log('valueGroupBy1', valueGroupBy1)
        arrayRecords = arrayRecords.sort((a,b) => {
            const valA = String(a[indexValueGroupBy1]);
            const valB = String(b[indexValueGroupBy1]);
            if(settingGroupBy1.ascending) {
                if (valA === null && valB !== null) return -1;
                if (valB === null && valA !== null) return 1;
                if (valA === null && valB === null) return 0;
                
                return valA - valB;
            } else {
                if (valA === null && valB !== null) return 1;
                if (valB === null && valA !== null) return -1;
                if (valA === null && valB === null) return 0;
                
                return valA + valB;
            }
        }).map(x => {
            let sortedValue = x[indexValueGroupBy1]
            let unsortedValue = x.filter((_, index) => index !== indexValueGroupBy1)
            return [sortedValue,...unsortedValue]
        })
        console.log('arrayRecords', arrayRecords)
        console.log('settingGroupBy1', settingGroupBy1)
        let isTimeStamp = columnsData[valueGroupBy1].data_type.startsWith('timestamp')
        if(isTimeStamp) {
            if(settingGroupBy1.timestamp === 'day') arrayRecords.forEach((element,index) => {
                arrayRecords[index][0] = statisticsUtils.getFormattedDay(element[0])
            })
            else if(settingGroupBy1.timestamp === 'month') arrayRecords.forEach((element,index) => {
                arrayRecords[index][0] = statisticsUtils.getFormattedMonth(element[0])
            })
            else arrayRecords.forEach((element,index) => {
                arrayRecords[index][0] = statisticsUtils.getFormattedYear(element[0])
            })
        } else {
            arrayRecords.forEach((element,index) => {arrayRecords[index][0] = String(element[0])})
        }
        for(let i = 0; i < arrayRecords.length; i++) {
            let value = arrayRecords[i][0]
            let filterdRecords = arrayRecords.filter(x => x[0] === value)
            filterdRecords.forEach((e,i) => {
                filterdRecords[i].shift()
            })
            value += ' (' + filterdRecords.length + ')'
            result.push([value, filterdRecords])
            i = i + filterdRecords.length - 1
        }
        console.log('result grouped:', result)
        return result
    }

    const returnTable = () => {
        let table
        let header = []
        let rows = []

        console.log('valueGroupBy1', valueGroupBy1)
        console.log('valueGroup2', valueGroupBy2)
        console.log('columnsData', columnsData)

        if(!valueGroupBy1 && !valueGroupBy2) {
            header = returnHeader(columns)
            rows = returnBody(records)
        } else if(valueGroupBy1 && !valueGroupBy2) {
            let indexValueGroupBy1 = columns.findIndex(x => x === valueGroupBy1)
            if(indexValueGroupBy1 === -1) {
                setNeedsRefresh(true)
                return <div></div>
            }
            let filterdColumns = columns.filter(x => x !== valueGroupBy1)
            let arrayColumns = [valueGroupBy1,...filterdColumns]
            let recordsByvalueGroupBy1 = returnGroupedRecords(records,indexValueGroupBy1)
            header = returnHeader(arrayColumns)
            rows = returnBodyGroupedBy1(recordsByvalueGroupBy1,arrayColumns)
        } else if(valueGroupBy1 && valueGroupBy2) {

        }

        table = [header,rows]
        return <table className="table-statistics">{table}</table>
    }

    return (<div className="statistics-wrapper">
        {needsRefresh && <p className="p-back">PLEASE REFRESH</p>}
        {!needsRefresh && returnTable()}
    </div>)
})

export default Table