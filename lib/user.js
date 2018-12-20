const authenticate = require('./functions/authenticate.js');
const chalk = require('chalk');
const camelCase = require('camelcase');

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
user.delete = async function (userId, transferTo, transferSheets, removeFromSharing) {
    const smartsheet = await authenticate.oAuth([]);
    let options = {
        id: userId
    };
    if (transferTo) {
        options.transferTo = transferTo;
    }
    options.transferSheets = transferSheets;
    options.removeFromSharing = removeFromSharing;
    return smartsheet.users.removeUser(options);
};

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
user.listUsers = async function (pagination = {}) {
    const smartsheet = await authenticate.oAuth([]);
    let options = {
        'queryParameters': pagination
    };
    return await smartsheet.users.listAllUsers(options);
};

/**
 * Adds a user.
 *
 * @returns Promise
 */
user.add = async function (email, isAdmin, isLicensed, firstName, lastName, groupAdmin, resourceViewer) {
    const smartsheet = await authenticate.oAuth([]);
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
    return await smartsheet.users.addUser(options);
};

/**
 *
 * @returns Promise
 */
user.editRole = async function (op, role, userId) {
    const smartsheet = await authenticate.oAuth([]);
    return new Promise((resolve, reject) => {
        // Validate the requested user role.
        const roles = ['admin', 'group-admin', 'licensed-sheet-creator', 'resource-viewer'];
        if (roles.indexOf(role) === -1) {
            // This is user input, so handle it gracefully.
            reject('Role must be one of "admin", "group-admin", "licensed-sheet-creator", "resource-viewer".');
            return;
        }
        // Validate the op.
        if (['add', 'remove'].indexOf(op) === -1) {
            // This is programmer error, so throw a fit.
            throw new Error('op must be "add" or "remove"');
        }

        // Prepare user object for the API.
        let user = {};
        user[camelCase(role)] = (op === 'add' ? true : false);
        let options = {
            id: userId,
            body: user
        };
        smartsheet.users.updateUser(options)
            .then(json => resolve(json.result))
            .catch(error => reject(error));
    });
};

user.display = function (record) {
    let identifier = record.email;
    if (record.name) {
        identifier = record.name + ' (' + record.email + ')';
    }
    console.log(chalk.bold.yellow(identifier));
    if (record.admin) {
        console.log(chalk.bold('System Administrator'));
    }
    console.log('ID: %s', record.id);
    if (record.status) {
        console.log('Status: %s', record.status);
    }
    if (record.sheetCount) {
        console.log('Owns %s sheets', record.sheetCount);
    }
    console.log('Licensed: %s', (record.licensedSheetCreator ? 'Yes' : 'No'));
    console.log('Group admin: %s', (record.groupAdmin ? 'Yes' : 'No'));
    console.log('Resource viewer: %s', (record.resourceViewer ? 'Yes' : 'No'));
    console.log('');

};

module.exports = user;
