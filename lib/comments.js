const authenticate = require('./functions/authenticate.js');
var fs = require('fs');

module.exports = {
    addComment : (sheetId, discussionId, comment) => {
        const gotAuth = authenticate.oAuth([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        // Specify comment
        var commentJson = { "text": comment };

        // Set options
        var options = {
            sheetId: sheetId,
            discussionId: discussionId,
            body: commentJson
        };

        // Add comment to discussion
        smartsheet.sheets.addDiscussionComment(options)
            .then(function (newComment) {
                console.log(newComment);
            })
            .catch(function (error) {
                console.log(error);
            });

    })}
};