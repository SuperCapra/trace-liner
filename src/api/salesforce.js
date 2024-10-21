import brandingPalette from "../brandingPalette"

const saleforceApiUtils = {
    storeRefreshToken(setting, userCode, name, refreshToken) {
        console.log(window.location.href)
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
            body: this.getBodyStringified(setting, userCode, 'Token', 'StravaUserId__c', name, refreshToken)
        }).then(response => response.json())
        .then(data => {
            console.log('Upsert Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    getBodyStringified(setting, userCode, object, field, name, refreshToken) {
        return  JSON.stringify({
            username: setting.REACT_APP_SALESFORCE_USERNAME,
            password: setting.REACT_APP_SALESFORCE_PASSWORD,
            securityToken: setting.REACT_APP_SALESFORCE_SECURITY_TOKEN,
            clientId: setting.REACT_APP_SALESFORCE_CLIENT_ID,
            clientSecret: setting.REACT_APP_SALESFORCE_SECRET_KEY,
            instanceUrl: setting.REACT_APP_SALESFORCE_URL,
            userCode: userCode,
            object: object,
            field: field,
            body: this.getBodyTokens(name, refreshToken),
        })
    },
    getBodyTokens(name,refreshToken) {
        return `{"Name":"${name}","refreshToken":"${refreshToken}"}`
    },
    getBodyLog(info) {
        let result = '{'

        if(info.stravaName) result += `"StravaName__c":"${info.stravaName}",`
        if(info.stravaId) result += `"StravaId__c":"${info.stravaId}",`
        if(info.size) result += `"Size__c":"${info.size}",`
        if(info.image) result += `"Image__c":"${info.image}",`
        if(info.filter) result += `"Filter__c":"${info.filter}",`
        if(info.mode) result += `"Mode__c":"${info.mode}",`
        if(info.color) result += `"Color__c":"${info.color}",`
        result += `"ShowDate__c":"${info.showDate}",`
        result += `"ShowElevation__c":"${info.showElevation}",`
        result += `"ShowPower__c":"${info.showPower}",`
        result += `"ShowCoordinates__c":"${info.showCoordinates}",`
        result += `"ShowDistance__c":"${info.showDistance}",`
        result += `"ShowDuration__c":"${info.showDuration}",`
        result += `"ShowAverage__c":"${info.showAverage}",`
        result += `"ShowTitle__c":"${info.showTitle}"}`

        return result
    },
    inizializeInfo(atheleinfo) {
        return {
            color: brandingPalette.white,
            filter: '0',
            image: 'default-1',
            mode: 'mode 1',
            showAverage: true,
            showCoordinates: false,
            showDate: true,
            showDistance: true,
            showDuration: true,
            showElevation: true,
            showPower: true,
            showTitle: true,
            size: 'rectangle',
            stravaId: atheleinfo ? atheleinfo.stravaId: undefined,
            stravaName: atheleinfo ? atheleinfo.name : undefined,
        }
    },
    setMode1(info) {
        info.showAverage = true
        info.showCoordinates = false
        info.showDate = true
        info.showDistance = true
        info.showDuration = true
        info.showElevation = true
        info.showPower = true
        info.showTitle = true
        info.showTitle = true
        return info
    },
    setMode2(info) {
        info.showAverage = false
        info.showCoordinates = false
        info.showDate = true
        info.showDistance = true
        info.showDuration = true
        info.showElevation = true
        info.showPower = false
        info.showTitle = true
        info.showTitle = true
        return info
    },
    setMode3(info) {
        info.showAverage = true
        info.showCoordinates = false
        info.showDate = false
        info.showDistance = true
        info.showDuration = true
        info.showElevation = true
        info.showPower = true
        info.showTitle = false
        info.showTitle = false
        return info
    },
    setMode4(info) {
        info.showAverage = true
        info.showCoordinates = false
        info.showDate = false
        info.showDistance = true
        info.showDuration = true
        info.showElevation = true
        info.showPower = true
        info.showTitle = false
        info.showTitle = false
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