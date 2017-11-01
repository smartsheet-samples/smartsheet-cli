const qs = require('querystring');
const path = require('path');
const fs = require('fs-extra');
const http = require('http');

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
            client_id: clientId,
            scope: scope
        };
        const authUrl = authorizeURL(params);

        if (options.force) {
            fs.removeSync(tokenFile);
        }

        // Check if we have previously stored a token.
        fs.readFile(tokenFile, 'utf8', (err, token) => {
            console.log('token: '+ token);
            if (err !== null || token === '') {
            console.log('here');
            
                // get Smartsheet access token through OAuth
                const server = http.createServer((req, res) => {
                    console.log(req);
                    const parsedUrl = url.parse(req.url, true);
                    console.log(parsedUrl);
                    // if (queryAsObject.code) {
                    //     oauth2Client.getToken(queryAsObject.code, (err, token) => {
                    //         if (err) {
                    //             reject(err);
                    //             return;
                    //         }
                    //         oauth2Client.credentials = token;
                    //         storeToken(token).then(() => {
                    //             resolve(oauth2Client);
                    //             return;
                    //         }, (err) => {
                    //             reject(err);
                    //             return;
                    //         });
                    //     });
                    // }
        
                    res.writeHead(302, {
                        'Location': 'https://gas-include.firebaseapp.com/info/auth_successful.html',
                    });
                    res.end();
        
                    req.connection.end(); // close the socket
                    req.connection.destroy(); // close it really
                    server.close(); // close the server
                }).listen(constants.REDIRECT_PORT);
        
                openWebpage(authUrl);
                console.log(`A webbrowser should have opened, to allow 'Smartsheet-CLI' to:`);
                console.log(`    'Access your Smartsheet Account`);
                console.log(``);
                console.log(`These permissions are necessary for pulling and pushing data from/to your Smartsheet Account.`);

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
