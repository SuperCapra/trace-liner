import logUtils from '../utils/logUtils.js'
const dbUtils = {
    getQueryInsert(data,table) {
        logUtils.loggerText('data', data)
      
        const columns = Object.keys(data)
        const values = Object.values(data)
        const placeholders = columns.map((_,index) => `$${index + 1}`)
      
        const query = `INSERT into ${table} (${columns.join(',')})
          VALUES (${placeholders.join(',')}) 
          RETURNING id`
      
        const result = {
          query: query,
          values: values
        }
      
        return result
    },
    getQueryUpdate(data,table,id) {
        logUtils.loggerText('data', data)
        
        const columns = Object.keys(data)
        const values = Object.values(data)
        const columnsPlaceHolders = columns.map((e,i) => `${e} = $${i + 1}`)
        logUtils.loggerText('columnsPlaceHolders:', columnsPlaceHolders)
        
        const query = `UPDATE ${table}
            SET ${columnsPlaceHolders.join(',')}
            WHERE id = ${id}
            RETURNING id`
        
        const result = {
            query: query,
            values: values
        }
        
        return result
    },
    getQuerySelectAll(table,whereClause) {
        console.log('query:', `SELECT * FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : ''))
        return `SELECT * FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '')
    },
    getQuerySelectFieldsAll(table,fields,whereClause) {
        console.log('query:', `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : ''))
        return `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '')
    },
    getQuerySelectRecord(table,field,value) {
        console.log('query:', `SELECT * FROM ${table} WHERE ${field} = '${value}'`)
        return `SELECT * FROM ${table} WHERE ${field} = '${value}'`
    },
    getQuerySelectFieldsRecord(table,fields,field,value) {
        console.log('query:', `SELECT ${fields.join(',')} FROM ${table} WHERE ${field} = '${value}'`)
        return `SELECT ${fields.join(',')} FROM ${table} WHERE ${field} = '${value}'`
    }
}

module.exports = dbUtils;