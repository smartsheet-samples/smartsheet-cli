const authenticate = require('./functions/authenticate.js');

module.exports = (options) => {

    const gotAuth = authenticate(options);

};