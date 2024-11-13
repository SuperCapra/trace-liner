const dbUtils = {
    // GMT datetime formatted to "yyyy-MM-dd HH:mm:ss.SSS"
    getTimestampGMT() {
        const now = new Date();

        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    },
    // Local datetime formatted to "yyyy-MM-dd HH:mm:ss.SSS"
    getTimestampLocal() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    },
    getTimezoneOffset() {
        const now = new Date();
        const offsetMinutes = now.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetRemainingMinutes = Math.abs(offsetMinutes) % 60;
        const sign = offsetMinutes <= 0 ? "+" : "-";
        
        return `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetRemainingMinutes).padStart(2, '0')}`
    },
    getTimezoneName() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    getQueryInsert(recordData,timeData,table) {
        console.log('recordData', recordData)
        console.log('timeData', timeData)
        const data = {...recordData, ...timeData}
        console.log('data', data)
      
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
    getQueryUpdate(recordData,timeData,table,id) {
        console.log('recordData', recordData)
        console.log('timeData', timeData)
        const data = {...recordData, ...timeData}
        console.log('data', data)
        
        const columns = Object.keys(data)
        const values = Object.values(data)
        const columnsPlaceHolders = columns.map((e,i) => `${e} = $${i + 1}`)
        console.log('columnsPlaceHolders:', columnsPlaceHolders)
        
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
    },

}

module.exports = dbUtils;