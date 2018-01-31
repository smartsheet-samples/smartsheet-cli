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

        // spin up local http server to receive auth code callback from Smartsheet
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const queryAsObject = parsedUrl.query;
            const authCode = queryAsObject.code;

            // generate the hash required by Smartsheet
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
                // store the retrieved token to the local token.json file
                storeToken(result).then(() => {
                    resolve();
                }, (error) => {
                    reject(error);
                });
                // instantiate new smartsheet client for making API calls with the new token
                const newSmartsheet = smartsheetClient.createClient({
                    accessToken: result.access_token
                });
                resolve(newSmartsheet);
            });
            // send response to browser to let user know auth is successful
            res.writeHead(302, {
                'Location': 'https://smartsheet-samples.github.io/sscli.html',
            });
            res.end();

            req.connection.end(); // close the socket
            req.connection.destroy(); // close it really
            server.close(); // close the server
        }).listen(constants.REDIRECT_PORT);  // callback server listens on the redirect_port in constants

        // opens browser to the authorizationURL (auth consent form in Smartsheet)
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
                    const token = {access_token: access_token};

                    storeToken(token)
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
            // set file path for the token.json file
            const tokenFile = path.join(constants.APP_DIR, constants.TOKEN_FILE);
            const params = {
                response_type: 'code',
                client_id: constants.CLIENT_ID,
                redirect_url: constants.REDIRECT_URL + ":" + constants.REDIRECT_PORT,
                scope: constants.SCOPE
            };
            // build authorization URL with params values
            const authUrl = authorizeURL(params);

            // Check if we have previously stored a token.
            fs.readFile(tokenFile, 'utf8', (err, token) => {
                if (err !== null || token === '') {
                    // if there is no tokenFile getNewToken
                    getNewToken(authUrl).then((smartsheetClient) => {
                        resolve(smartsheetClient);
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    // use the token from the token.json file to create smartsheet client
                    let parsedToken = JSON.parse(token);
                    smartsheet = smartsheetClient.createClient({
                        accessToken: parsedToken.access_token
                    });
                    // check if token needs to be refreshed and then refresh auth token
                    smartsheet.users.getCurrentUser()
                    .then(function(userProfile) {
                        resolve(smartsheet);
                    })
                    .catch(function(error) {
                        // check for smartsheet errorCode 1003 (Your Access Token has expired)
                        if (error.errorCode === 1003) {
                            // refresh the token
                            const generated_hash = require('crypto')
                                .createHash('sha256')
                                .update(constants.CLIENT_SECRET + "|" + parsedToken.REFRESH_TOKEN)
                                .digest('hex');
                            const options = {
                                queryParameters: {
                                    client_id: constants.CLIENT_SECRET,
                                    refresh_token: parsedToken.REFRESH_TOKEN,
                                    hash: generated_hash
                                }
                            };
                            smartsheet.tokens.refreshAccessToken(options, storeToken)
                                .then((token) => {
                                    storeToken(token).then(() => {
                                        resolve();
                                    }, (error) => {
                                        reject(error);
                                    });
                                    const newSmartsheet = smartsheetClient.createClient({
                                        accessToken: token.access_token
                                    });
                                    resolve(newSmartsheet);
                                });
                        }
                        console.log(error);
                    });
                }
            });
        });
    }
}