import '../App.css';
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import statisticsUtils from '../utils/statisticsUtils';
import brandingPalette from '../config/brandingPalette';

const Table = forwardRef((_,ref) => {

    const [needsRefresh,setNeedsRefresh] = useState(false)
    const [groupedData,setGroupedData] = useState([])
    const [table, setTable] = useState(<div></div>)
    const [graph, setGraph] = useState(<div></div>)

    const setRefreshNeeded = () => {
        setNeedsRefresh(true)
    }

    const resetGroupedData = () => {
        setGroupedData([])
    }

    const returnHeader = (arrayHeader) => {
        let header = []
        for(let element of arrayHeader) header.push(<th className="cell-table">{element}</th>)
        return <thead className="header-table-statistics"><tr className="row-table">{header}</tr></thead>
    }

    // const returnRow = (record, value)

    const returnBody = (arrayRecords) => {
        console.log('arrayRecords', arrayRecords)
        let rows = []
        for(let record of arrayRecords) {
            let row = []
            for(let i in record) {
                row.push(<td className="cell-table">{record[i].valueDisplayed}</td>)
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
            let firstRow = []
            let otherRows = []
            firstRow.push(<td className="cell-table" rowSpan={record[0].cardinality + 1}>{record[0].valueDisplayed}</td>)
            for(let indexGroup in record[1]) {
                let elementGroup = record[1][indexGroup]
                let subRow = []
                console.log('record[1]:', record[1])
                for(let indexElement in elementGroup) {
                    let element = elementGroup[indexElement]
                    console.log('element: ', element)
                    // console.log('element !== undefined ? element.valueDisplayed : undefined: ', element !== undefined ? element.valueDisplayed : undefined)
                    // console.log('element !== undefined && element.value !== null ? \'\' : \' invisible-null\': ', element !== undefined && element.value !== null ? '' : ' invisible-null')
                    let valueDisplayed = element !== undefined ? element.valueDisplayed : undefined
                    let callCell = element !== undefined && element.value !== null ? 'cell-table-horizontal' : 'cell-table-horizontal invisible-null'
                    if(indexGroup === 0) firstRow.push(<td className={callCell}>{valueDisplayed}</td>)
                    else subRow.push(<td className={callCell}>{valueDisplayed}</td>)
                }
                otherRows.push(<tr className="row-table">{subRow}</tr>)
            }
            rows.push(<tr className="row-table">{firstRow}</tr>)
            rows.push(...otherRows)
        }
        return <tbody>{rows}</tbody>
    }

    const returnBodyGroupedBy1AndBy2 = (arrayRecordsGrouped,columnsReordered) => {
        let rows = []
        console.log('arrayRecordsGrouped:', arrayRecordsGrouped)
        console.log('columnsReordered:', columnsReordered)
        for(let record of arrayRecordsGrouped) {
            let firstRow = []
            let otherRows = []
            firstRow.push(<td className="cell-table" rowspan={record[0].cardinality}>{record[0].valueDisplayed}</td>)
            for(let indexElement in record[1]) {
                let element = record[1][indexElement]
                let subFirstRow = []
                let otherSubRows = []
                // let subQuadroRow = []
                console.log('element:', element)
                if(Number(indexElement) === 0) firstRow.push(<td className="cell-table" rowspan={element[0].cardinality}>{element[0].valueDisplayed}</td>)
                    else subFirstRow.push(<td className="cell-table" rowspan={element[0].cardinality}>{element[0].valueDisplayed}</td>)
                console.log('indexElement:', indexElement)
                for(let indexSubElementGroup in element[1]) {
                    let elementSubElementGroup = element[1][indexSubElementGroup]
                    // console.log('elementSubElementGroup:', elementSubElementGroup)
                    let otherSubRow = []
                    for(let indexElementSubElement in elementSubElementGroup) {
                        let elementSubElement = elementSubElementGroup[indexElementSubElement]
                        // console.log('elementSubElement:', elementSubElement)
                        let valueDisplayed = elementSubElement !== undefined ? elementSubElement.valueDisplayed : undefined
                        let classInvisibleCell = elementSubElement !== undefined && elementSubElement.value !== null ? '' : ' invisible-null'
                        console.log('indexElement:', indexElement)
                        if(Number(indexSubElementGroup) === 0 && Number(indexElement) === 0) firstRow.push(<td className={classInvisibleCell}>{valueDisplayed}</td>)
                        else if(Number(indexSubElementGroup) === 0) subFirstRow.push(<td className={classInvisibleCell}>{valueDisplayed}</td>)
                        else otherSubRow.push(<td className={classInvisibleCell}>{valueDisplayed}</td>)
                    }
                    // otherSubRows.push(<tr className="row-table">{subQuadroRow}</tr>)
                    // if(Number(indexSubElementGroup) === 0 && Number(indexElement) !== 0) rows.push(<tr className="row-table">{firstSubRow}</tr>)
                    // else rows.push(<tr className="row-table">{otherSubRow}</tr>)
                    if(Number(indexElement) !== 0 && Number(indexSubElementGroup) !== 0) otherSubRows.push(<tr className="row-table">{otherSubRow}</tr>)
                }
                // otherRows.push(<tr className="row-table">{subRow}</tr>)
                otherRows.push(<tr className="row-table">{subFirstRow}</tr>)
                otherRows.push(...otherSubRows)
            }
            console.log('firstRow:', firstRow)
            rows.push(<tr className="row-table">{firstRow}</tr>)
            rows.push(...otherRows)

            // let transposedMatrix = record[1][0].map((_, colIndex) => record[1].map(row => row[colIndex]));
            // let columnGrouping = []
            // for(let groupingElement of transposedMatrix[0]) {
            //     columnGrouping.push(<tr className="cell-table"><td>{groupingElement}</td></tr>)
            // }
            // row.push(<td className="cell-table">{columnGrouping.valueDisplayed}</td>)

            // let flatteredMatrix = []
            // for(let i in transposedMatrix[1]) {
            //     for(let j in transposedMatrix[1][i]) {
            //         flatteredMatrix.push(transposedMatrix[1][i][j])
            //     }
            // }
            // let retransposedMatrix = flatteredMatrix[0].map((_, colIndex) => flatteredMatrix.map(row => row[colIndex]));
            // for(let indexRowTransposed in retransposedMatrix) {
            //     let rowTransposed = retransposedMatrix[indexRowTransposed]
            //     let subColumn = []
            //     for(let indexColumnTransposed in rowTransposed) {
            //         let valueDisplayed = rowTransposed[indexColumnTransposed] ? rowTransposed[indexColumnTransposed].valueDisplayed : undefined
            //         let classInvisibleCell = (rowTransposed[indexColumnTransposed] && rowTransposed[indexColumnTransposed].value !== null ? '' : ' invisible-null')
            //         subColumn.push(<tr><td className={classInvisibleCell}>{valueDisplayed}</td></tr>)
            //     }
            //     row.push(<td className="cell-table">{subColumn}</td>)
            // }
            // rows.push(<tr className="row-table">{row}</tr>)
        }
        return <tbody>{rows}</tbody>
    }

    const compareValues = (a,b,ascending) => {
        if(ascending) {
            // console.log('ascending:', ascending)
            // console.log('descending:', a-b)
            if ((a === null || a === undefined) && (b !== null || b !== undefined)) return -1;
            if ((b === null || b === undefined) && (a !== null || a !== undefined)) return 1;
            if ((a === null || a === undefined) && (b === null || b === undefined)) return 0;
            
            return a - b;
        } else {
            // console.log('descending:', ascending)
            // console.log('descending:', a-b)
            if ((a === null || a === undefined) && (b !== null || b !== undefined)) return 1;
            if ((b === null || b === undefined) && (a !== null || a !== undefined)) return -1;
            if ((a === null || a === undefined) && (b === null || b === undefined)) return 0;
            
            return a + b;
        }
    }

    const sortAndSetFirstColumnSortedFormatted = (arrayRecords,indexSorting,settings) => {
        arrayRecords = arrayRecords.sort((a,b) => {
            // const valA = String(a[indexSorting] ? a[indexSorting].value : undefined);
            const valA = a[indexSorting] ? a[indexSorting].value : undefined;
            const valB = b[indexSorting] ? b[indexSorting].value : undefined;
            return compareValues(valA,valB,settings.ascending)
        })
        .map(x => {
            let sortedElement = x[indexSorting]
            // console.log('sortedElement', sortedElement)
            let unsortedElements = x.filter((_, index) => index !== indexSorting)
            if(settings.isTimestamp) {
                sortedElement.valueDisplayed = settings.timestamp === 'day' ? statisticsUtils.getFormattedDay(sortedElement.value) : (settings.timestamp === 'month' ? statisticsUtils.getFormattedMonth(sortedElement.value) : statisticsUtils.getFormattedYear(sortedElement.value))
            }
            return [sortedElement,...unsortedElements]
        })
        return arrayRecords
    }

    const returnGraph = (_groupedData,_value2,_maxCardinality1) => {
        console.log('groupedData', _groupedData)
        let graph = []
        let cardinalityArray1 = []
        let cardinalityArray2by1 = []
        _groupedData.forEach(x => {
            cardinalityArray1.push(Number(x.cardinality))
            if(_value2 && x.subGroupedData && x.subGroupedData.length) {
                let tempCardinalityArray = []
                x.subGroupedData.forEach(y => {tempCardinalityArray.push(y.cardinality)})
                cardinalityArray2by1.push(tempCardinalityArray)
            }
        })
        let maxData1 = Math.max(...cardinalityArray1)
        let maxData2By1 = []
        for(let e of cardinalityArray2by1) maxData2By1.push(Math.max(...e))
        console.log('cardinalityArray1', cardinalityArray1)
        console.log('cardinalityArray2by1', cardinalityArray2by1)
        console.log('maxData1', maxData1)
        console.log('maxData2By1', maxData2By1)
        let bars = []
        // let labels = []
        let groupedDataLength = _groupedData.length
        let widthGraph = _groupedData.length < 5 ? 600 : (_groupedData.length < 10 ? 900 : (_groupedData.length < 15 ? 1300 : 1500))
        let widthBar = (widthGraph/groupedDataLength) + 'px'
        let marginBar = ((widthGraph/groupedDataLength) * 0.05) + 'px'
        let marginText = ((widthGraph/groupedDataLength) * 0.025) + 'px'
        console.log('marginBar', marginBar)
        let styleGraph = {
            width: widthGraph
        }
        for(let indexGroupedData in _groupedData) {
            let elementRpw = _groupedData[indexGroupedData]
            let labelRow = elementRpw.value + ' (' + cardinalityArray1[indexGroupedData] + ')'
            let heightBar = (elementRpw.cardinality / maxData1) * 100
            let styleBar = {
                height: String(heightBar) + '%',
                width: widthBar,
                background: brandingPalette.primary,
                margin: '0 ' + marginBar + ' 0 ' + marginBar
            }
            // let styleLabels = {
            //     margin: '0 ' + marginBar + ' 0 ' + marginBar
            // }
            let styleText = {
                margin: marginText + ' 0 ' + marginText + ' 0'
            }
            if(!_value2) {
                bars.push(<div className="light-bar" style={styleBar}><p className="font-statistics-graph" style={styleText}>{labelRow}</p></div>)
            } else {
                let subbar = []
                // let lengthSubGroupedDate = elementRpw.subGroupedData.length
                for(let indexSubbarData in elementRpw.subGroupedData) {
                    let elementSubRow = elementRpw.subGroupedData[indexSubbarData]
                    let labelSubRow = elementSubRow.value + ' (' + cardinalityArray2by1[indexGroupedData][indexSubbarData] + ')'
                    let heightSubBar = (cardinalityArray2by1[indexGroupedData][indexSubbarData] / cardinalityArray1[indexGroupedData]) * 100
                    let styleSubBar = {
                        width: widthBar,
                        height: String(heightSubBar) + '%',
                        background: indexSubbarData % 2 === 0 ? brandingPalette.primary : brandingPalette.secondary,
                    }
                    subbar.push(<div className="light-bar" style={styleSubBar}><p className="font-statistics-graph" style={styleText}>{labelSubRow}</p></div>)
                }
                bars.push(<div className="sub-bar-wrapper" style={styleBar}>{subbar}</div>)
            }
            // labels.push(<div style={styleLabels}><p className="p-back">{groupedData[indexGroupedData].value}</p></div>)
        }
        graph.push(<div className="bars-wrapper" style={styleGraph}>{bars}</div>)
        // graph.push(<div className="labels-wrapper">{labels}</div>)
        // setGraphRendered(true)
        return <div className="graph-wrapper">{graph}</div>
    }

    const returnGroupedRecords = (arrayRecords, indexValueGroupBy1,_settingValue1) => {
        // let arrayRecords = returnArrayFromJson(arrayRecordsJson)
        let result = []
        let groupedDataTemp = []
        let _maxCardinality1 = 0

        console.log('arrayRecords', arrayRecords)

        arrayRecords = sortAndSetFirstColumnSortedFormatted(arrayRecords,indexValueGroupBy1,_settingValue1)

        for(let i = 0; i < arrayRecords.length; i++) {
            let element = arrayRecords[i][0]
            let value = element.valueDisplayed
            let filterdRecords = arrayRecords
            .filter(x => x[0].valueDisplayed === value)
            .map(record => record.slice(1));
            groupedDataTemp.push({value: value, cardinality: filterdRecords.length, records: filterdRecords })
            let elementGrouping = {
                value: value,
                valueDisplayed: value + ` (${filterdRecords.length})`,
                cardinality: filterdRecords.length
            }
            if(_maxCardinality1 < filterdRecords.length) _maxCardinality1 = filterdRecords.length
            result.push([elementGrouping, [...filterdRecords]])
            i += elementGrouping.cardinality - 1
        }
        if(!groupedData.length) setGroupedData(groupedDataTemp)
        setGraph(returnGraph(groupedDataTemp, undefined, _maxCardinality1))
        console.log('groupedDataTemp:', groupedDataTemp)
        console.log('result grouped:', result)
        return result
    }

    const returnDoubleGroupedRecords = (arrayRecords,indexValueGroupBy1,indexValueGroupBy2,_value2,_settingValue1,_settingValue2) => {
        let result = []
        let groupedDataTemp = []
        let _maxCardinality1 = 0
        console.log('arrayRecords', arrayRecords)

        arrayRecords = sortAndSetFirstColumnSortedFormatted(arrayRecords,indexValueGroupBy1,_settingValue1)
        for(let i = 0; i < arrayRecords.length; i++) {
            let element = arrayRecords[i][0]
            let value = element.valueDisplayed
            let filterdRecords = arrayRecords
                                    .filter(x => x[0].valueDisplayed === value)
                                    .map(record => record.slice(1));
            let elementGrouping = {
                value: value,
                valueDisplayed: value + ` (${filterdRecords.length})`,
                cardinality: filterdRecords.length,
                cardinalitySubGroup: 0
            }
            groupedDataTemp.push({value: value, cardinality: filterdRecords.length, subGroupedData: [] })
            if(_maxCardinality1 < filterdRecords.length) _maxCardinality1 = filterdRecords.length
            result.push([elementGrouping, [...filterdRecords]])
            i += filterdRecords.length - 1
        }
        if(indexValueGroupBy2 > indexValueGroupBy1) indexValueGroupBy2 -= 1
        for(let i = 0; i < result.length; i++) {
            let subRecords = result[i][1]
            subRecords = sortAndSetFirstColumnSortedFormatted(subRecords,indexValueGroupBy2,_settingValue2)
            result[i][1] = []
            for(let j = 0; j < subRecords.length; j++) {
                let subElement = subRecords[j][0]
                let subValue = subElement.valueDisplayed
                let subFilterdRecords = subRecords
                                            .filter(x => x[0].valueDisplayed === subValue)
                                            .map(record => record.slice(1));
                let subElementGrouping = {
                    value: subValue,
                    valueDisplayed: subValue + ` (${subFilterdRecords.length})`,
                    cardinality: subFilterdRecords.length
                }
                groupedDataTemp[i]['subGroupedData'].push({labelValue: subValue, value: subValue, cardinality: subFilterdRecords.length, records: subFilterdRecords })
                result[i][0].cardinalitySubGroup = result[i][0].cardinalitySubGroup + subFilterdRecords.length + 1
                result[i][1].push([subElementGrouping, [...subFilterdRecords]])
                j += subFilterdRecords.length - 1
            }
        }
        if(!groupedData.length) setGroupedData(groupedDataTemp)
        setGraph(returnGraph(groupedDataTemp,_value2,_maxCardinality1))
        console.log('groupedDataTemp:', groupedDataTemp)
        console.log('result double grouped:', result)
        return result
    }

    const returnTable = (_columns, _records, _value1, _settingValue1, _value2, _settingValue2) => {
        let table
        let header = []
        let rows = []
        setNeedsRefresh(false)
        if(groupedData.length) {
            setGroupedData([])
        }

        console.log('valueGroupBy1', _value1)
        console.log('valueGroupBy2', _value2)
        console.log('columns', _columns)
        console.log('setting 1', _settingValue1)
        console.log('setting 2', _settingValue2)
        if(!_value1 && !_value2) {
            header = returnHeader(_columns)
            rows = returnBody(_records)
        } else if(_value1 && !_value2) {
            let indexValueGroupBy1 = _columns.findIndex(x => x === _value1)
            if(indexValueGroupBy1 === -1) {
                setNeedsRefresh(true)
                return <div></div>
            }
            let filteredColumns = _columns.filter(x => x !== _value1)
            let arrayColumns = [_value1,...filteredColumns]
            let recordsByValueGroupBy1 = returnGroupedRecords(_records,indexValueGroupBy1, _settingValue1)
            header = returnHeader(arrayColumns)
            rows = returnBodyGroupedBy1(recordsByValueGroupBy1,arrayColumns)
        } else if(_value1 && _value2) {
            let indexValueGroupBy1 = _columns.findIndex(x => x === _value1)
            let indexValueGroupBy2 = _columns.findIndex(x => x === _value2)
            if(indexValueGroupBy1 === -1 || indexValueGroupBy2 === -1) {
                setNeedsRefresh(true)
                return <div></div>
            }
            let filteredColumns = _columns.filter(x => x !== _value1 && x !== _value2)
            let arrayColumns = [_value1,_value2,...filteredColumns]
            let recordsByValueGroupBy2ByValueGroupBy1 = returnDoubleGroupedRecords(_records,indexValueGroupBy1,indexValueGroupBy2,_value2,_settingValue1,_settingValue2)

            header = returnHeader(arrayColumns)
            rows = returnBodyGroupedBy1AndBy2(recordsByValueGroupBy2ByValueGroupBy1,arrayColumns)
        }
        table = [header,rows]
        return <table id="statsTable" className="table-statistics font-statistics">{table}</table>
    }

    const resetTable = (_columns, _records, _value1, _settingValue1, _value2, _settingValue2) => {
        setTable(returnTable(_columns, _records, _value1, _settingValue1, _value2, _settingValue2))
    }

    useImperativeHandle(ref, () => ({
        setRefreshNeeded,
        resetGroupedData,
        resetTable
    }));

    return (<div className="statistics-wrapper">
        {needsRefresh && <p className="p-back">PLEASE REFRESH</p>}
        {!needsRefresh && groupedData.length > 0 && graph}
        {!needsRefresh && table}
    </div>)
})

export default Table