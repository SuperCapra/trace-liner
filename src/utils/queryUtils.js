const queryUtils = {
    getQuerySelectFieldsAll(table,fields,whereClause) {
        console.log('query:', `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : ''))
        return `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '')
    },
    getQuerySelectFieldsWithFilter(table,fields,column,minor,major,columnsData,groupBy1,groupBy2) {
        let whereClause
        if(column) whereClause = this.getWhereClause(column,minor,major,columnsData)
        console.log('groupBy1', groupBy1)
        console.log('groupBy2', groupBy2)
        console.log('whereClause', whereClause)
        console.log('fields', fields)
        let fieldsStringified = fields && fields.length ? fields.join(',') : '*'
        if(groupBy1 && fields && fields.length && !fieldsStringified.includes(groupBy1)) fieldsStringified += ',' + groupBy1
        if(groupBy2 && fields && fields.length && !fieldsStringified.includes(groupBy2)) fieldsStringified += ',' + groupBy2
        console.log('query:', `SELECT ${fieldsStringified} FROM ${table}` + (whereClause && whereClause.length ? ' WHERE ' + whereClause : ''))
        return `SELECT ${fieldsStringified} FROM ${table}` + (whereClause && whereClause.length ? ' WHERE ' + whereClause : '')
    },
    getWhereClause(column,minor,major,columnsData) {
        let whereClause = ''
        if(!column) return whereClause
        let integerOrTimestamp = columnsData[column].data_type.startsWith('integer') ? true : false
        if(minor) whereClause += column + ' > ' + (integerOrTimestamp ? '' : '\'') + minor + (integerOrTimestamp ? '' : '\'')
        if(whereClause.length && major) whereClause += ' AND '
        if(major) whereClause += column + ' < ' + (integerOrTimestamp ? '' : '\'') + major + (integerOrTimestamp ? '' : '\'')
        return whereClause
    }
}

export default queryUtils