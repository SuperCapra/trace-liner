import apiUtils from '../utils/apiUtils'
const dbInteractions = {
    async createRecordEditable(table,token,body) {
        const url = apiUtils.getUrlHost() + `/api/editable/${table}`
        const id = await fetch(url, {
            method : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            return data.id
        }).catch(e => {
            console.error(`Error creating ${table} record:`, e)
        })
        return id
    },
    async createRecordNonEditable(table,token,body) {
        const url = apiUtils.getUrlHost() + `/api/noneditable/${table}`
        const id = await fetch(url, {
            method : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            return data.id
        }).catch(e => {
            console.error(`Error creating ${table} record:`, e)
        })
        return id
    },
    async updateRecordEditable(table,token,idUpdating,body) {
        const url = apiUtils.getUrlHost() + `/api/editable/${table}/${idUpdating}`
        const id = await fetch(url, {
            method : 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            return data.id
        }).catch(e => {
            console.error(`Error updating ${table} record with ${idUpdating} id:`, e)
        })
        return id
    },
    async updateRecordNonEditable(table,token,idUpdating,body) {
        const url = apiUtils.getUrlHost() + `/api/noneditable/${table}/${idUpdating}`
        const id = await fetch(url, {
            method : 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            return data.id
        }).catch(e => {
            console.error(`Error updating ${table} record with ${idUpdating} id:`, e)
        })
        return id
    },
    async getRecordId(table,token,field,value) {
        const url = apiUtils.getUrlHost() + `/api/${table}/${field}/${value}`
        const data = await fetch(url, {
            method : 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(data => {
            return data
        }).catch(e => {
            console.error(`Error querying ${table} record with fields ${field} equal to ${value}:`, e)
        })
        return data
    }
}

export default dbInteractions