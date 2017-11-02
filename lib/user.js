const authenticate = require('./functions/authenticate.js');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

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
    const smartsheet = await(authenticate());
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
            authenticate([]).then(function (smartsheet) {
                smartsheet.users.getUser(options)
                    .then(data => resolve(data))
                    .catch(error => reject(error));
            }).catch(error => reject(error));
        }
    );
};

/**
 * List all users.
 *
 * TODO: options for pagination
 *
 * @returns Promise
 */
user.listUsers = async (function () {
    const smartsheet = await(authenticate([]));
    return await(smartsheet.users.listAllUsers());
});

module.exports = user;
