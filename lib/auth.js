const authenticate = require('./functions/authenticate.js');

module.exports = {
    login: () => { 
        const gotAuth = authenticate.oAuth(); 
        const gotCurrentUser = Promise.all([gotAuth, ]).then((values) => {
            
            
            return smartsheet.users.getCurrentUser()
            .then(function(userProfile) {
                console.log(userProfile);
                return userProfile;
            })
            .catch(function(error) {
                console.log(error);
            });
    
    
        });
        gotCurrentUser.then((info) => {
            process.stdout.write(`You are successfully authenticated as \'${info.email}\'`);
            displayCheckbox('green');
            return;
        }).catch((err) => {
            handleError(err, false);
            return;
        });
    },
    logout: () => { authenticate.deleteToken(); }
};