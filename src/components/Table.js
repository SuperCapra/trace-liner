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

    const compareValues = (a,b,ascending) => {
        if(ascending) {
            if ((a === null || a === undefined) && (b !== null || b !== undefined)) return -1;
            if ((b === null || b === undefined) && (a !== null || a !== undefined)) return 1;
            if ((a === null || a === undefined) && (b === null || b === undefined)) return 0;
            
            return a - b;
        } else {
            if ((a === null || a === undefined) && (b !== null || b !== undefined)) return 1;
            if ((b === null || b === undefined) && (a !== null || a !== undefined)) return -1;
            if ((a === null || a === undefined) && (b === null || b === undefined)) return 0;
            
            return a + b;
        }
    }

    const returnArrayFromJson = (arrayRecordsJson) => {
        let arrayRecords = []
        for(let record of arrayRecordsJson) {
            let row = []
            for(let column in record) row.push(record[column])
            arrayRecords.push(row)
        }
        console.log('arrayRecords',arrayRecords)
        return arrayRecords
    }

    const sortAndSetFirstColumnSortedFormatted = (arrayRecords,name,indexSorting,settings,data) => {
        arrayRecords = arrayRecords.sort((a,b) => {
            const valA = String(a[indexSorting]);
            const valB = String(b[indexSorting]);
            return compareValues(valA,valB,settings.ascending)
        }).map(x => {
            let sortedValue = x[indexSorting]
            let unsortedValue = x.filter((_, index) => index !== indexSorting)
            let isTimestamp = data[name].data_type.startsWith('timestamp')
            if(isTimestamp) {
                if(settings.timestamp === 'day') sortedValue = statisticsUtils.getFormattedDay(sortedValue)
                else if(settings.timestamp === 'month') sortedValue = statisticsUtils.getFormattedMonth(sortedValue)
                else sortedValue = statisticsUtils.getFormattedYear(sortedValue)
            } else {
                sortedValue = String(sortedValue)
            }
            return [sortedValue,...unsortedValue]
        })
        return arrayRecords
    }

    const returnGroupedRecords = (arrayRecordsJson, indexValueGroupBy1) => {
        let arrayRecords = returnArrayFromJson(arrayRecordsJson)
        let result = []

        arrayRecords = sortAndSetFirstColumnSortedFormatted(arrayRecords,valueGroupBy1,indexValueGroupBy1,settingGroupBy1,columnsData)

        for(let i = 0; i < arrayRecords.length; i++) {
            let value = arrayRecords[i][0]
            let filterdRecords = arrayRecords.filter(x => x[0] === value)
            filterdRecords.forEach((_,j) => {
                filterdRecords[j].shift()
            })
            value += ' (' + filterdRecords.length + ')'
            result.push([value, filterdRecords])
            i += filterdRecords.length - 1
        }
        console.log('result grouped:', result)
        return result
    }

    const returnDoubleGroupedRecords = (arrayRecordsJson,indexValueGroupBy1,indexValueGroupBy2) => {
        console.log('arrayRecordsJson:', arrayRecordsJson)
        let arrayRecords = returnArrayFromJson(arrayRecordsJson)
        let result = []

        arrayRecords = sortAndSetFirstColumnSortedFormatted(arrayRecords,valueGroupBy1,indexValueGroupBy1,settingGroupBy1,columnsData)
        console.log('arrayRecords:', arrayRecords)
        for(let i = 0; i < arrayRecords.length; i++) {
            let value = arrayRecords[i][0]
            let filterdRecords = arrayRecords.filter(x => x[0] === value)
            filterdRecords.forEach((_,j) => {
                filterdRecords[j].shift()
            })
            value += ' (' + filterdRecords.length + ')'
            result.push([value, filterdRecords])
            i += filterdRecords.length - 1
        }
        console.log('indexValueGroupBy1:', indexValueGroupBy1)
        console.log('indexValueGroupBy2:', indexValueGroupBy2)
        if(indexValueGroupBy2 > indexValueGroupBy1) indexValueGroupBy2 -= 1
        console.log('indexValueGroupBy2:', indexValueGroupBy2)
        console.log('result:', result)
        for(let i = 0; i < result.length; i++) {
            let subRecords = result[i][1]
            console.log('subRecords:', subRecords)
            subRecords = sortAndSetFirstColumnSortedFormatted(subRecords,valueGroupBy2,indexValueGroupBy2,settingGroupBy2,columnsData)
            console.log('subRecords:', subRecords)
            result[i][1] = []
            for(let j = 0; j < subRecords.length; j++) {
                let subValue = subRecords[j][0]
                let subFilterdRecords = subRecords.filter(x => x[0] === subValue)
                subFilterdRecords.forEach((_,k) => {
                    subFilterdRecords[k].shift()
                })
                subValue += ' (' + subFilterdRecords.length + ')'
                result[i][1].push([subValue, subFilterdRecords])
                j += subFilterdRecords.length - 1
            }

        }
        console.log('result double grouped:', result)
        return result
    }

    const returnTable = () => {
        let table
        let header = []
        let rows = []

        console.log('valueGroupBy1', valueGroupBy1)
        console.log('valueGroupBy2', valueGroupBy2)
        console.log('columnsData', columnsData)

        if(!valueGroupBy1 && !valueGroupBy2) {
            console.log('no grouping')
            header = returnHeader(columns)
            rows = returnBody(records)
        } else if(valueGroupBy1 && !valueGroupBy2) {
            console.log('grouping by 1')
            let indexValueGroupBy1 = columns.findIndex(x => x === valueGroupBy1)
            if(indexValueGroupBy1 === -1) {
                setNeedsRefresh(true)
                return <div></div>
            }
            let filterdColumns = columns.filter(x => x !== valueGroupBy1)
            let arrayColumns = [valueGroupBy1,...filterdColumns]
            let recordsByValueGroupBy1 = returnGroupedRecords(records,indexValueGroupBy1)
            header = returnHeader(arrayColumns)
            rows = returnBodyGroupedBy1(recordsByValueGroupBy1,arrayColumns)
        } else if(valueGroupBy1 && valueGroupBy2) {
            console.log('grouping by 1 and 2')
            let indexValueGroupBy1 = columns.findIndex(x => x === valueGroupBy1)
            let indexValueGroupBy2 = columns.findIndex(x => x === valueGroupBy2)
            if(indexValueGroupBy1 === -1 || indexValueGroupBy2 === -1) {
                setNeedsRefresh(true)
                return <div></div>
            }
            let filterdColumns = columns.filter(x => x !== valueGroupBy1 && x !== valueGroupBy2)
            let arrayColumns = [valueGroupBy1,valueGroupBy2,...filterdColumns]
            let recordsByValueGroupBy2ByValueGroupBy1 = returnDoubleGroupedRecords(records,indexValueGroupBy1,indexValueGroupBy2)

            // header = returnHeader(arrayColumns)
            // rows = returnBodyGroupedBy1(recordsByValueGroupBy2ByValueGroupBy1,arrayColumns)
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