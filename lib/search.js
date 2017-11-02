const authenticate = require('./functions/authenticate.js');

module.exports = {
    searchAll : (searchTerm) => {
        const gotAuth = authenticate([]);
        Promise.all([gotAuth, ]).then((values) => {
            const smartsheet = values[0];
            const options = {
                query: searchTerm.args[0]
            };
            smartsheet.search.searchAll(options)
                .then(function(results) {
                    console.log(results);
                })
                .catch(function(error) {
                    console.log(error);
                });
        })
    },
    searchSheet : (sheetId, searchTerm) => {
        // not implemented yet
    }
};