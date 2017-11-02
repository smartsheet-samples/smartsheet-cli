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

//TODO check for the directory and create it if does not exist. FS-Extra docs --> ensureDir
function storeToken(token) {
    return new Promise((resolve, reject) => {
        const userAuthInfo = JSON.stringify(token);
        const newFile = path.join(constants.APP_DIR, constants.TOKEN_FILE)
        fs.writeFile(newFile, userAuthInfo, 'utf8', (err) => {
            if (err) { reject(err) }
            resolve();
        });
    })
}

function getNewToken(authUrl) {
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
                queryParameters: {
                    client_id: constants.CLIENT_ID,
                    code: authCode,
                    hash: generated_hash,
                }
            };
            
            const newSmartsheetClient = smartsheet.tokens.getAccessToken(options).then((error, result) => {
                if (error) {
                    console.error('Access Token Error:', error.message);
                    reject(error);
                    return;
                }
                newSmartsheet = smartsheetClient.createClient({
                    accessToken: result.access_token
                });
                storeToken(result).then(() => {
                    resolve();
                    return;
                }, (error) => {
                    reject(error);
                    return;
                });
            });
            res.writeHead(302, {
                'Location': 'https://smartsheet-samples.github.io/sscli.html',
            });
            res.end();
            req.connection.end(); // close the socket
            req.connection.destroy(); // close it really
            server.close(); // close the server
            resolve(newSmartsheetClient);
        }).listen(constants.REDIRECT_PORT);

        opn(authUrl);

        console.log(`A webbrowser should have opened, to allow 'Smartsheet-CLI' to:`);
        console.log(`    'Access your Smartsheet Account`);
        console.log(``);
        console.log(`These permissions are necessary for pulling and pushing data from/to your Smartsheet Account.`);
        //TODO create a Smartsheet client in this block
    });
}
module.exports = {
    deleteToken : () => {
        return new Promise((resolve, reject) => {
            fs.removeSync(path.join(constants.APP_DIR, constants.TOKEN_FILE));
            resolve();
            return;
        })
    },

    oAuth: () => {
        return new Promise((resolve, reject) => {
            const tokenFile = path.join(constants.APP_DIR, constants.TOKEN_FILE);
            const params = {
                response_type: 'code',
                client_id: constants.CLIENT_ID,
                redirect_url: constants.REDIRECT_URL + ":" + constants.REDIRECT_PORT,
                scope: constants.SCOPE
            };
            const authUrl = authorizeURL(params);

            // Check if we have previously stored a token.
            fs.readFile(tokenFile, 'utf8', (err, token) => {
                if (err !== null || token === '') {
                    getNewToken(authUrl).then((smartsheetClient) => {
                        resolve(smartsheetClient);
                        return;
                    }, (err) => {
                        reject(err);
                        return;
                    });
                } else {
                    let parsedToken = JSON.parse(token);
                    // todo: check if token needs to be refreshed and then refresh auth token
                    console.log('accessToken: ' + token);
                    smartsheet = smartsheetClient.createClient({
                        accessToken: parsedToken.access_token
                    });
                    resolve(smartsheet);
                    return;
                }
            });
        });
    }
}