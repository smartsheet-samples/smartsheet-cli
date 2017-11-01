// const smartsheetClient = require('smartsheet');

// const smartsheet = smartsheetClient.createClient({accessToken: accessToken});
const authenticate = require('./functions/authenticate.js');

module.exports = (options) => {
    
        const gotAuth = authenticate(options);
        console.log(gotAuth);    
    };