const saleforceApiUtils = {
    login(username,password,securityToken,url,subdirectory,clientId,secretKey,body,object,field,externalKey,action){
        console.info('Salesforce: getting access token...')
         url = url + '?grant_type=password' +
            '&client_id=' + clientId +
            '&client_secret=' + secretKey +
            '&username=' + username +
            '&password=' + password + securityToken
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
            },
          })
          .then(response => response.json())
            .then(res => {
                // console.log(res.Response)
                let accessToken = res.body.access_token
                let instanceUrl = res.body.instance_url
                switch (action) {
                    case 'upsert':
                        this.upsert(instanceUrl,subdirectory,object,field,externalKey,accessToken,body)
                    break
                    default:
                        console.log('no actioc selected')
                }
            })
            .catch(e => {
                console.log('Error Saleforce Login: ', e)
            })
    },
    upsert(instanceUrl,subdirectory,object,field,externalKey,acessToken,body) {
        let url = instanceUrl + subdirectory + object + '/' + field + '/' + externalKey
        fetch(url, {
            method: 'PATCH',
            mode: 'no-cors', // Set mode to no-cors
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'Accept-Encoding': 'gzip, deflate, br',
              'Content-Length': '0',
              'Authorization': `Bearer ${acessToken}`
            },
            body: JSON.stringify(body)
          }).then(response => response.json())
            .then(res => {
                console.log('res: ', res)
                // console.log(res)
                // let accessToken = res.access_token
                // switch (action) {
                //     case 'insert':
                //         this.insert(accessToken,body)
                //     break
                //     default:
                //         console.log('no actioc selected')
                // }
            })
            .catch(e => {
                console.log('Error Saleforce Insert')
            })
    },
    getBodyTokens(name,refreshToken) {
        return JSON.stringify({
            Name: name ? `${name}` : `${refreshToken}`,
            StravaRefreshToken__c: `${refreshToken}`,
        })
    },
    storeRefreshToken(setting, userCode, name, refreshToken) {
        console.log(window.location.href)
        let href = window.location.href
        let pathname = window.location.pathname +'?'
        console.log('pathname:', pathname)
        console.log('href:', href)
        let urlHost = href.substring(0,href.indexOf(pathname))
        let url = `${urlHost}/api/salesforce-login-and-upsert`
        console.log('urlHost:', urlHost)
        console.log('url:', url)
        fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: setting.REACT_APP_SALESFORCE_USERNAME,
                password: setting.REACT_APP_SALESFORCE_PASSWORD,
                securityToken: setting.REACT_APP_SALESFORCE_SECURITY_TOKEN,
                clientId: setting.REACT_APP_SALESFORCE_CLIENT_ID,
                clientSecret: setting.REACT_APP_SALESFORCE_SECRET_KEY,
                instanceUrl: setting.REACT_APP_SALESFORCE_URL,
                userCode: userCode,
                body: this.getBodyTokens(name, refreshToken),
            }),
        }).then(response => response.json())
            .then(data => {
              console.log('Upsert Success:', data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
          
    }
}

export default saleforceApiUtils