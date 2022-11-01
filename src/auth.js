export const getAccessToken = async (token, clientId) => {
    let headers = {
        'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        'content-type': 'application/x-amz-json-1.1',
    }

    let body = {
        AuthFlow: 'REFRESH_TOKEN',
        AuthParameters: {
            REFRESH_TOKEN: token
        },
        ClientId: clientId
    }

    let response = await fetch('https://cognito-idp.us-east-1.amazonaws.com/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })

    if (!response.ok) {
        throw new Error('Could not get access token: ' + await response.text())
    }
    let data = await response.json()
    return data.AuthenticationResult.AccessToken
}