const authenticate = require('./functions/authenticate.js');

module.exports = {
        login: authenticate.oAuth(),

        logout: authenticate.deleteToken()

};