import '../App.css';
import React from 'react';
import brandingPalette from '../config/brandingPalette';

function Table(props) {

    const {columns, records} = props

    const returnTable = () => {
        let table
        let header = []
        let rows = []

        for(let column of columns) header.push(<th className="cell-table">{column}</th>)
        header = <thead className="header-table-statistics"><tr className="row-table">{header}</tr></thead>
        for(let record of records) {
            let row = []
            for(let value in record) {
                row.push(<td className="cell-table">{record[value]}</td>)
            }
            rows.push(<tr className="row-table">{row}</tr>)
        }
        rows = <tbody>{rows}</tbody>

        table = [header,rows]
        return <table className="table-statistics">{table}</table>
    }

    return (<div className="statistics-wrapper">
        {returnTable()}
    </div>)
}

export default Table