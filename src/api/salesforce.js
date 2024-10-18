const saleforceApiUtils = {
    login(username,password,securityToken,url,subdirectory,clientId,secretKey,body,object,field,externalKey,action){
        console.info('Salesforce: getting access token...')
        let bodyLogin = {
            grant_type: 'password',
            client_id: clientId,
            secret_key: secretKey,
            username: username,
            password: password + securityToken
        }
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'Accept-Encoding': 'gzip, deflate, br',
              'Content-Length': '0'
            },
            body: JSON.stringify(bodyLogin)
          }).then(response => response.json())
            .then(res => {
                console.log(res)
                let accessToken = res.access_token
                let instanceUrl = res.instance_url
                switch (action) {
                    case 'upsert':
                        this.insert(instanceUrl,subdirectory,object,field,externalKey,accessToken,body)
                    break
                    default:
                        console.log('no actioc selected')
                }
            })
            .catch(e => {
                console.log('Error Saleforce Login')
            })
    },
    upsert(instanceUrl,subdirectory,object,field,externalKey,acessToken,body) {
        let url = instanceUrl + subdirectory + '/' + object + '/' + field + '/' + externalKey
        fetch(url, {
            method: 'PATCH',
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
    }
}

export default saleforceApiUtils