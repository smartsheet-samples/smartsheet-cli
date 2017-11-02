const authenticate = require('./functions/authenticate.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

module.exports = {
    login: () => { 
        const gotAuth = authenticate.oAuth(); 
        const gotCurrentUser = Promise.all([gotAuth, ]).then((values) => {
            const smartsheet = values[0];
            console.log(smartsheet)
            smartsheet.users.getCurrentUser()
                .then(function(userProfile) {
                    process.stdout.write(`You are successfully authenticated as \'${userProfile.email}\'`);
                    displayCheckbox('green');
                })
                .catch(function(error) {
                    console.log(error);
                });

        });
    },
    logout: () => { authenticate.deleteToken(); }
};