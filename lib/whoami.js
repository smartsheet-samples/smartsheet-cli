const authenticate = require('./functions/authenticate.js');

module.exports = (options) => {
    
    const gotAuth = authenticate([]);
    
    const currentUser = Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        smartsheet.users.getCurrentUser()
        .then(function(userProfile) {
            console.log(userProfile);
        })
        .catch(function(error) {
            console.log(error);
        });


    });
};