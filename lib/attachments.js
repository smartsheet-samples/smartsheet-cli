const authenticate = require('./functions/authenticate.js');
var fs = require('fs');

module.exports = {
    listAttachments : (sheetId) => {
        const gotAuth = authenticate([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        // Set options
        var options = {
            sheetId: sheetId
        };

        // List attachments
        smartsheet.sheets.listAttachments(options)
            .then(function (attachmentsList) {
                console.log(attachmentsList);
            })
            .catch(function (error) {
                console.log(error);
            });

    })},

    getAttachment : (sheetId, attachmentId) => {
            const gotAuth = authenticate([]);
            Promise.all([gotAuth, ]).then((values) => {
            const smartsheet = values[0];

            // Set options
            var options = {
                sheetId: sheetId,
                attachmentId: attachmentId
            };

            // Get attachment
            smartsheet.sheets.getAttachment(options)
                .then(function (attachment) {
                    console.log(attachment);
                })
                .catch(function (error) {
                    console.log(error);
                });

        })}
};