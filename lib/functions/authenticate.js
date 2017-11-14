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
/**
 * Saves access token to disk
 * 
 * @param token
 * @returns {Promise} 
 */
function storeToken(token) {
    return fs.ensureDir(constants.APP_DIR)
        .then(() => {
            const userAuthInfo = JSON.stringify(token);
            const newFile = path.join(constants.APP_DIR, constants.TOKEN_FILE)
            fs.writeFile(newFile, userAuthInfo, 'utf8', (err) => {
                if (err) { return err; }
            });
        })
        .catch((err) => {
            console.error(err)
        });
}

/**
 * Get and store smartsheet access token taking user through oauth flow
 * 
 * @param string authUrl 
 * @returns {Promise}
 */
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
            
            smartsheet.tokens.getAccessToken(options, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                storeToken(result).then(() => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
                const newSmartsheet = smartsheetClient.createClient({
                    accessToken: result.access_token
                });
                resolve(newSmartsheet);
            });
            res.writeHead(302, {
                'Location': 'https://smartsheet-samples.github.io/sscli.html',
            });
            res.end();
            req.connection.end(); // close the socket
            req.connection.destroy(); // close it really
            server.close(); // close the server
        }).listen(constants.REDIRECT_PORT);

        opn(authUrl);

        console.log(`A web page should opened to allow 'Smartsheet-CLI' to:`);
        console.log(`    'Access your Smartsheet Account`);
        console.log(`These permissions are necessary for pulling data from and pushing data to your Smartsheet Account.`);
    });
}
module.exports = {
    deleteToken : () => {
        return new Promise((resolve, reject) => {
            fs.removeSync(path.join(constants.APP_DIR, constants.TOKEN_FILE));
            resolve();
        })
    },
    manual: (access_token) => {
        return new Promise((resolve, reject) => {
            // make a call to smartsheet to test the validity of the token
            smartsheet = smartsheetClient.createClient({
                accessToken: access_token
            });

            smartsheet.users.getCurrentUser()
                .then(function(userProfile) {
                    // if token seems valid, save it to the token_file
                    storeToken(access_token)
                        .then(() => {
                            resolve(smartsheet);
                        }, (error) => {
                            reject(error);
                        });
                })
                .catch(function(error) {
                    console.error(error);
                    process.exit(1);
                });

        });
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
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    let parsedToken = JSON.parse(token);
                    // todo: check if token needs to be refreshed and then refresh auth token
                    smartsheet = smartsheetClient.createClient({
                        accessToken: parsedToken.access_token
                    });
                    resolve(smartsheet);
                }
            });
        });
    }
}