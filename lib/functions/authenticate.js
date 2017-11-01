const qs = require('querystring');
const path = require('path');
const fs = require('fs-extra');

const constants = require('../constants.js');

const smartsheetClient = require('smartsheet');
let smartsheet = smartsheetClient.createClient({
    accessToken: ''
});


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

        if (options.force) {
            fs.removeSync(tokenFile);
        }

        // Check if we have previously stored a token.
        fs.readFile(tokenFile, 'utf8', (err, token) => {
            if (err !== null || token === '') {
                // get Smartsheet access token through OAuth
            } else {
                let parsedToken = JSON.parse(token);
                // todo: check if token needs to be refreshed and then refresh auth token
                console.log('accessToken: '+ token);
                // set token to smartsheet client
                smartsheet = smartsheetClient.createClient({
                    accessToken: parsedToken.access_token
                });
            }
        });
    });
}

module.exports = authenticate;
