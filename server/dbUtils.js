const dbUtils = {
    getQueryInsert(data,table) {
        this.loggerText('data', data)
      
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
    getQueryAuth(data,token) {
        this.loggerText('data', data)
      
        const columns = Object.keys(data)
        const values = Object.values(data)
        const placeholders = columns.map((_,index) => `$${index + 1}`)
        let indexToken = columns.findIndex(e => e === 'auth_token')
        if(indexToken >= 0) placeholders[indexToken] =`pgp_sym_encrypt(${placeholders[indexToken]}, '${token}')`
      
        const query = `INSERT into users_auth (${columns.join(',')})
          VALUES (${placeholders.join(',')}) 
          RETURNING id`

        console.log('query:', query)
        console.log('values:', values)
      
        const result = {
          query: query,
          values: values
        }
      
        return result
    },
    getQueryUpdate(data,table,id) {
        this.loggerText('data', data)
        
        const columns = Object.keys(data)
        const values = Object.values(data)
        const columnsPlaceHolders = columns.map((e,i) => `${e} = $${i + 1}`)
        this.loggerText('columnsPlaceHolders:', columnsPlaceHolders)
        
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
        // console.log('query:', `SELECT * FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '')  + ' ORDER BY id')
        return `SELECT * FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '')
    },
    getQuerySelectFieldsAll(table,fields,whereClause) {
        // console.log('query:', `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '') + ' ORDER BY id')
        return `SELECT ${fields.join(',')} FROM ${table}` + (whereClause ? ' WHERE ' + whereClause : '')
    },
    getQuerySelectRecord(table,field,value) {
        // console.log('query:', `SELECT * FROM ${table} WHERE ${field} = '${value}'`)
        return `SELECT * FROM ${table} WHERE ${field} = '${value}'`
    },
    getQuerySelectFieldsRecord(table,fields,field,value) {
        // console.log('query:', `SELECT ${fields.join(',')} FROM ${table} WHERE ${field} = '${value}'`)
        return `SELECT ${fields.join(',')} FROM ${table} WHERE ${field} = '${value}'`
    },
    logger(message) {
        if(process.env.NODE_ENV === 'development') console.log(message)
    },
    loggerText(text,message) {
        if(process.env.NODE_ENV === 'development') console.log(text,message)
    }
}

module.exports = dbUtils;