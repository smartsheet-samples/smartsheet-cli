'use strict'
const qs = require('querystring');
const path = require('path');
const fs = require('fs-extra');
const http = require('http');
const opn = require('opn');
const url = require('url');


const constants = require('../constants.js');

const smartsheetClient = require('smartsheet');
let smartsheet = smartsheetClient.createClient({
    accessToken: ''
});

function authorizeURL(params) {
    const authUrl = 'https://app.smartsheet.com/b/authorize';
    return `${authUrl}?${qs.stringify(params)}`;
}


function storeToken(token) {
    return new Promise((resolve, reject) => {
        const file = {
            name: path.join(constants.APP_DIR, constants.TOKEN_FILE),
            source: JSON.stringify(token),
        };
        createFile(file);
        resolve();
        return;
    });
}

function authenticate(options) {
    return new Promise((resolve, reject) => {
        const clientSecret = constants.CLIENT_SECRET;
        const clientId = constants.CLIENT_ID;
        const redirectUrl = constants.REDIRECT_URL;
        const port = constants.REDIRECT_PORT;
        const tokenFile = path.join(constants.APP_DIR, constants.TOKEN_FILE);
        const scope = constants.SCOPE;
        const params = {
            response_type: 'code',
            client_id: clientId,
            redirect_url: redirectUrl+":"+port,
            scope: scope
        };
        const authUrl = authorizeURL(params);

        if (options.force) {
            fs.removeSync(tokenFile);
        }

        // Check if we have previously stored a token.
        fs.readFile(tokenFile, 'utf8', (err, token) => {
            if (err !== null || token === '') {
            
            return new Promise((resolve, reject) => {
                // get Smartsheet access token through OAuth
                const server = http.createServer((req, res) => {
                    const parsedUrl = url.parse(req.url, true);
                    const queryAsObject = parsedUrl.query;                    
                    const authCode = queryAsObject.code;

                    const generated_hash = require('crypto')
                        .createHash('sha256')
                        .update(constants.CLIENT_SECRET + "|" + authCode, 'utf8')
                        .digest('hex');
                
                    const options = {
                         queryParameters : {
                            client_id: constants.CLIENT_ID,
                            code: authCode,
                            hash: generated_hash,
                        }
                    };
                    // console.log(queryParameters);
                    smartsheet.tokens.getAccessToken(options, (error, result) => {
                        if (error) {
                            console.error('Access Token Error', error.message);
                            return res.json('Authentication failed');
                        }
                        console.log('The resulting token: ', result);
                
                        return res
                            .status(200)
                            .json(result);
                    });
        
                    res.writeHead(302, {
                        'Location': 'https://gas-include.firebaseapp.com/info/auth_successful.html',
                    });
                    res.end();
        
                    req.connection.end(); // close the socket
                    req.connection.destroy(); // close it really
                    server.close(); // close the server
                }).listen(constants.REDIRECT_PORT);
                
                console.log(authUrl);
                opn(authUrl);

                console.log(`A webbrowser should have opened, to allow 'Smartsheet-CLI' to:`);
                console.log(`    'Access your Smartsheet Account`);
                console.log(``);
                console.log(`These permissions are necessary for pulling and pushing data from/to your Smartsheet Account.`);
            });
            } else {
                let parsedToken = JSON.parse(token);
                // todo: check if token needs to be refreshed and then refresh auth token
                console.log('accessToken: '+ token);
                // set token to smartsheet client
                smartsheet = smartsheetClient.createClient({
                    accessToken: parsedToken.access_token
                });
                resolve(smartsheet);
                return;
            }
        });
    });
}

module.exports = authenticate;
