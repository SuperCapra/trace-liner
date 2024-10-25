import brandingPalette from "../brandingPalette"
import utils from "../utils.js"

const saleforceApiUtils = {
    storeRefreshToken(setting, userCode, name, refreshToken) {
        let href = window.location.href
        let pathname = window.location.pathname + '?'
        let urlHost = href.substring(0,href.indexOf(pathname))
        let url = `${urlHost}/api/salesforce-login-and-upsert`
        console.log('url:', url)
        fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: this.getBodyStringified(setting, userCode, 'Token__c', 'StravaUserId__c', this.getBodyTokens(name, refreshToken))
        }).then(response => response.json())
        .then(data => {
            // console.log('Upsert Success:', data);
        })
        .catch(error => {
            // console.error('Error:', error);
        });
    },
    storeLog(setting, athleteData, infoLog) {
        let href = window.location.href
        let pathname = window.location.pathname + '?'
        let urlHost = href.substring(0,href.indexOf(pathname))
        let url = `${urlHost}/api/salesforce-login-and-upsert`
        console.log('url:', url)
        fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: this.getBodyStringified(setting, athleteData.id + '_' + this.getSalesforceFormattedDate(), 'TracelinerLog__c', 'ExternalId__c', this.getBodyLog(infoLog))
        }).then(response => response.json())
        .then(data => {
            // console.log('Upsert Success:', data);
        })
        .catch(error => {
            // console.error('Error:', error);
        });
    },
    getBodyStringified(setting, externalId, object, field, body) {
        return  JSON.stringify({
            username: setting.REACT_APP_SALESFORCE_USERNAME,
            password: setting.REACT_APP_SALESFORCE_PASSWORD,
            securityToken: setting.REACT_APP_SALESFORCE_SECURITY_TOKEN,
            clientId: setting.REACT_APP_SALESFORCE_CLIENT_ID,
            clientSecret: setting.REACT_APP_SALESFORCE_SECRET_KEY,
            instanceUrl: setting.REACT_APP_SALESFORCE_URL,
            externalId: externalId,
            object: object,
            field: field,
            body: body,
        })
    },
    getBodyTokens(name,refreshToken) {
        return `{"Name":"${name}","StravaRefreshToken__c":"${refreshToken}"}`
    },
    getBodyLog(info) {
        let result = '{'

        result += `"Timestamp__c":"${this.getSalesforceFormattedDate()}",`
        if(info.stravaName) result += `"StravaName__c":"${info.stravaName}",`
        if(info.stravaId) result += `"StravaId__c":"${info.stravaId}",`
        if(info.size) result += `"Size__c":"${info.size}",`
        if(info.image) result += `"Image__c":"${info.image}",`
        if(info.filter) result += `"Filter__c":"${info.filter}",`
        if(info.mode) result += `"Mode__c":"${info.mode}",`
        if(info.color) result += `"Color__c":"${info.color}",`
        result += `"LoggedToStrava__c":"${info.stravaId ? true : false}",`
        result += `"ShowDate__c":"${info.showdate}",`
        result += `"ShowElevation__c":"${info.showelevation}",`
        result += `"ShowPower__c":"${info.showpower}",`
        result += `"ShowCoordinates__c":"${info.showcoordinates}",`
        result += `"ShowDistance__c":"${info.showdistance}",`
        result += `"ShowDuration__c":"${info.showduration}",`
        result += `"ShowAverage__c":"${info.showaverage}",`
        result += `"ShowTitle__c":"${info.showname}"}`

        return result
    },
    inizializeInfo(atheleinfo) {
        return {
            color: brandingPalette.white,
            filter: '0',
            image: 'default-1',
            mode: 'mode 1',
            showaverage: true,
            showcoordinates: false,
            showdate: true,
            showdistance: true,
            showduration: true,
            showelevation: true,
            showpower: true,
            showname: true,
            size: 'rectangle',
            stravaId: atheleinfo ? atheleinfo.id: undefined,
            stravaName: atheleinfo ? utils.getName(atheleinfo.firstname, atheleinfo.lastname) : undefined,
        }
    },
    setMode1(info) {
        info.showaverage = true
        info.showcoordinates = false
        info.showdate = true
        info.showdistance = true
        info.showduration = true
        info.showelevation = true
        info.showpower = true
        info.showtitle = true
        return info
    },
    setMode2(info) {
        info.showaverage = false
        info.showcoordinates = false
        info.showdate = true
        info.showdistance = true
        info.showduration = true
        info.showelevation = true
        info.showpower = false
        info.showname = true
        return info
    },
    setMode3(info) {
        info.showaverage = true
        info.showcoordinates = false
        info.showdate = false
        info.showdistance = true
        info.showduration = true
        info.showelevation = true
        info.showpower = true
        info.showname = false
        return info
    },
    setMode4(info) {
        info.showaverage = true
        info.showcoordinates = false
        info.showdate = false
        info.showdistance = true
        info.showduration = true
        info.showelevation = true
        info.showpower = true
        info.showname = false
        return info
    },
    getSalesforceFormattedDate() {
        const now = new Date();

        // Get individual components
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');

        // Construct the ISO 8601 formatted string
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    }
}

export default saleforceApiUtils