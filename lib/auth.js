const authenticate = require('./functions/authenticate.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

module.exports = {
    login: (accessToken) => { 
        let gotAuth = {};

        if (accessToken) {
            gotAuth = authenticate.manual(accessToken);
        } else {
            gotAuth = authenticate.oAuth(); 
        }
        Promise.all([gotAuth, ]).then((values) => {
            const smartsheet = values[0];
            smartsheet.users.getCurrentUser()
                .then(function(userProfile) {
                    process.stdout.write(`You are successfully authenticated as \'${userProfile.email}\'`);
                    displayCheckbox('green');
                    process.exit(1);
                })
                .catch(function(error) {
                    console.log(error);
                });
        });
    },
    logout: () => { authenticate.deleteToken(); },
};