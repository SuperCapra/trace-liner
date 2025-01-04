const queryUtils = {
    getQuerySelectFieldsAll(table,fields,whereClause) {
        console.log('query:', `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : ''))
        return `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '')
    }
}

export default queryUtils