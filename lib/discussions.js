const authenticate = require('./functions/authenticate.js');
var fs = require('fs');

module.exports = {
    listDiscussions : (sheetId) => {
        const gotAuth = authenticate([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        // Set options
        var options = {
            sheetId: sheetId
        };

        // List discussions
        smartsheet.sheets.getDiscussions(options)
            .then(function (discussionList) {
                console.log(discussionList);
            })
            .catch(function (error) {
                console.log(error);
            });

    })},

    createDiscussion : (sheetId, title, comment) => {
        const gotAuth = authenticate([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        var discussion = {
            "title": title,
            "comment": {
                "text": comment
            }
        };

        // Set options
        var options = {
            sheetId: sheetId,
            body: discussion
        };

        // Add discussion to sheet
        smartsheet.sheets.createDiscussion(options)
            .then(function (newDiscussion) {
                console.log(newDiscussion);
            })
            .catch(function (error) {
                console.log(error);
            });

    })}
};