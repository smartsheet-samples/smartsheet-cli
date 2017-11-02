const authenticate = require('./functions/authenticate.js');

module.exports = {
    createSheet : (sheetName) => {
        const gotAuth = authenticate([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        const sheet = {
            "name": sheetName,
            "columns": [
                {
                    "title":"Test Column",
                    "type":"TEXT_NUMBER",
                    "primary":true
                }
            ]
        };
        const options = {
            body: sheet
        };
        smartsheet.sheets.createSheet(options)
            .then(function(newSheet) {
                console.log(newSheet);
            })
            .catch(function(error) {
                console.log(error);
            });
    })},

    getSheet : (sheetId) => {
            const gotAuth = authenticate([]);
            Promise.all([gotAuth, ]).then((values) => {
            const smartsheet = values[0];

            // Set options
            var options = {
                id: sheetId // Id of Sheet
            };

            // Get sheet
            smartsheet.sheets.getSheet(options)
                .then(function(sheetInfo) {
                    console.log(sheetInfo);
                })
                .catch(function(error) {
                    console.log(error);
                });
    })}
};