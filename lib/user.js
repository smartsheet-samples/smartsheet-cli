const authenticate = require('./functions/authenticate.js');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const chalk = require('chalk');

let user = {};

/**
 * Deletes a user.
 *
 * @param number userId
 * @param number transferTo
 * @param boolean transferSheets
 * @param boolean removeFromSharing
 *
 * @returns {Promise}
 */
user.delete = async (function (userId, transferTo, transferSheets, removeFromSharing) {
    const smartsheet = await(authenticate.oAuth([]));
    let options = {
        id: userId
    };
    if (transferTo) {
        options.transferTo = transferTo;
    }
    options.transferSheets = transferSheets;
    options.removeFromSharing = removeFromSharing;
    return smartsheet.users.removeUser(options);
});

/**
 * Retrieves data on one user.
 *
 * @param userId
 * @returns {Promise}
 */
user.getInfo = (userId) => {
    let options = {};
    options.id = parseInt(userId);
    return new Promise((resolve, reject) => {
        authenticate.oAuth([])
            .then(function (smartsheet) {
                smartsheet.users.getUser(options)
                    .then(data => resolve(data))
                    .catch(error => reject(error));
                })
            .catch(error => reject(error));
        }
    );
};

/**
 * List all users.
 *
 * @param {Object} pagination
 *   An optional hash, which may include any combination of the following:
 *   - page
 *   - pageSize
 *   - includeAll
 *
 * @returns Promise
 */
user.listUsers = async (function (pagination = {}) {
    const smartsheet = await(authenticate.oAuth([]));
    let options = {
        'queryParameters': pagination
    };
    return await(smartsheet.users.listAllUsers(options));
});

/**
 * Adds a user.
 *
 * @returns Promise
 */
user.add = async (function (email, isAdmin, isLicensed, firstName, lastName, groupAdmin, resourceViewer) {
    const smartsheet = await(authenticate.oAuth([]));
    let account = {
        email: email,
        admin: isAdmin,
        licensedSheetCreator: isLicensed
    };
    if (firstName) account.firstName = firstName;
    if (lastName) account.lastName = lastName;
    if (groupAdmin) account.groupAdmin = groupAdmin;
    if (resourceViewer) account.resourceViewer = resourceViewer;
    let options = {
        body: account
    };
    return await(smartsheet.users.addUser(options));
});

user.display = function (record) {
    let identifier = record.email;
    if (record.name) {
        identifier = record.name + ' (' + record.email + ')';
    }
    // The API only displays status and other metadata
    // if the requestor is an administrator.
    if (!record.status) {
        console.log(identifier);
        return;
    }

    // For systems administrators, display more data.
    console.log(chalk.bold.yellow(identifier));
    if (record.admin) {
        console.log(chalk.bold('System Administrator'));
    }
    console.log('ID: %s', record.id);
    console.log('Status: %s', record.status);
    if (typeof record.sheetCount !== 'undefined') {
        console.log('Owns %s sheets', record.sheetCount);
    }
    console.log('Licensed: %s', (record.licensedSheetCreator ? 'Yes' : 'No'));
    console.log('Group admin: %s', (record.groupAdmin ? 'Yes' : 'No'));
    console.log('Resource viewer: %s', (record.resourceViewer ? 'Yes' : 'No'));
    console.log('');

};

module.exports = user;
