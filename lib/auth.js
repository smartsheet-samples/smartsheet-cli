const authenticate = require('./functions/authenticate.js');

module.exports = (options) => {

    const gotAuth = Promise.all([checkedVersion, ]).then(() => {
        return authenticate(options);
    });


};