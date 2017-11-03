const authenticate = require('./functions/authenticate.js');
var fs = require('fs');

module.exports = {
    listAttachments : (sheetId) => {
        const gotAuth = authenticate.oAuth([]);
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
            const gotAuth = authenticate.oAuth([]);
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

        })},

    uploadAttachment : (sheetId, commentId, rowId, file) => { // rowId attach not working yet
    const gotAuth = authenticate.oAuth([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        const stats = fs.statSync(file)
        const fileSizeInBytes = stats.size
        var fileName = file.split('\\').pop().split('/').pop()

        // Set options
        var options = {
            sheetId: sheetId,
            fileSize: fileSizeInBytes,
            fileName: fileName,
            fileStream: fs.createReadStream(file)
        };

        if(sheetId) {
            // Attach file to comment
            smartsheet.sheets.addFileAttachment(options)
                .then(function(attachment) {
                    console.log(attachment);
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        if(commentId) {
            options["commentId"] = commentId;

            // Attach file to comment
            smartsheet.sheets.addCommentFileAttachment(options)
                .then(function(attachment) {
                    console.log(attachment);
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

    })},

    deleteAttachment : (sheetId, attachmentId) => {
        const gotAuth = authenticate.oAuth([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        // Set options
        var options = {
            sheetId: sheetId,
            attachmentId: attachmentId
        };

        // Delete attachment
        smartsheet.sheets.deleteAttachment(options)
            .then(function (results) {
                console.log(results);
            })
            .catch(function (error) {
                console.log(error);
            });

        })},
};