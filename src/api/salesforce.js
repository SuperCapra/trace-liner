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