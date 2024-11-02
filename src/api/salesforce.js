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
    storeLog(setting, infoLog) {
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
            body: this.getBodyStringified(setting, this.getExternalId(infoLog), 'TracelinerLog__c', 'ExternalId__c', this.getBodyLog(infoLog))
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
        if(info.stravaActivityId) result += `"StravaActivityId__c":"${info.stravaActivityId}",`
        if(info.userCity) result += `"UserCity__c":"${info.userCity}",`
        if(info.userState) result += `"UserState__c":"${info.userState}",`
        if(info.userCountry) result += `"UserCountry__c":"${info.userCountry}",`
        if(info.userSex) result += `"UserSex__c":"${info.userSex}",`
        if(info.city) result += `"ActivityCity__c":"${info.city}",`
        if(info.state) result += `"ActivityState__c":"${info.state}",`
        if(info.country) result += `"ActivityCountry__c":"${info.country}",`
        if(info.isVirtual) result += `"IsVirtual__c":"${info.isVirtual}",`
        if(info.latitudeEnd) result += `"LatitudeEnd__c":"${info.latitudeEnd}",`
        if(info.latitudeStart) result += `"LatitudeStart__c":"${info.latitudeStart}",`
        if(info.longitudeEnd) result += `"LongitudeEnd__c":"${info.longitudeEnd}",`
        if(info.longitudeStart) result += `"LongitudeStart__c":"${info.longitudeStart}",`
        if(info.size) result += `"Size__c":"${info.size}",`
        if(info.image) result += `"Image__c":"${info.image}",`
        if(info.filter) result += `"Filter__c":"${info.filter}",`
        if(info.mode) result += `"Mode__c":"${info.mode}",`
        if(info.color) result += `"Color__c":"${info.color}",`
        if(info.unit) result += `"UnitOfMeasure__c":"${info.unit}",`
        result += `"LoggedToStrava__c":"${info.stravaId ? true : false}",`
        result += `"ShowDate__c":"${info.showdate}",`
        result += `"ShowElevation__c":"${info.showelevation}",`
        result += `"ShowPower__c":"${info.showpower}",`
        result += `"ShowCoordinates__c":"${info.showcoordinates}",`
        result += `"ShowDistance__c":"${info.showdistance}",`
        result += `"ShowDuration__c":"${info.showduration}",`
        result += `"ShowAverage__c":"${info.showaverage}",`
        result += `"ShowTitle__c":"${info.showname}"}`
        result += `"ExportType__c":"${info.exportType}"}`

        return result
    },
    inizializeInfo(atheleinfo,activityInfo) {
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
            latitudeEnd: activityInfo?.endLatitude,
            latitudeStart: activityInfo?.startLatitude,
            longitudeEnd: activityInfo?.endLongitude,
            longitudeStart: activityInfo?.startLongitude,
            isVirtual: activityInfo?.sportType === 'Virtual Ride',
            city: activityInfo?.locationCity,
            state: activityInfo?.locationState,
            country: activityInfo?.locationCountry,
            stravaId: atheleinfo ? atheleinfo.id: undefined,
            stravaActivityId: activityInfo?.id,
            stravaName: atheleinfo ? utils.getName(atheleinfo.firstname, atheleinfo.lastname) : undefined,
            userCity: atheleinfo ? atheleinfo.city : undefined,
            userState: atheleinfo ? atheleinfo.state : undefined,
            userCountry: atheleinfo ? atheleinfo.country : undefined,
            userSex: atheleinfo ? atheleinfo.sex : undefined,
            unit: 'metric',
            exportType: 'complete'
        }
    },
    setMode1(info) {
        info.mode = 'mode 1'
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
        info.mode = 'mode 2'
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
        info.mode = 'mode 3'
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
        info.mode = 'mode 4'
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
    },
    getExternalId(info) {
        return (info.stravaId ? `${info.stravaId}_${info.stravaActivityId}_` : 'nostrava_') + this.getSalesforceFormattedDate()
    }
}

export default saleforceApiUtils