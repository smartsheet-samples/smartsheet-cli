#!/usr/bin/env node
const user = require('./lib/user.js');
const program = require('commander');
const process = require('process');
const inquirer = require('inquirer');
const chalk = require('chalk');

program
    .option('-f, --force', 'Skip any confirmation prompts.');

program
    .command('add')
    .option('--email [email]', 'The user\'s email address.')
    .option('--admin', 'Make the user a system administrator.')
    .option('--licensed', 'Create this as a licensed account, with permission to create and own sheets.')
    .option('--first-name [name]', 'The user\'s first name.')
    .option('--last-name [name]', 'The user\'s last name.')
    .option('--group-admin', 'Give this user permission to create and edit groups')
    .option('--resource-viewer', 'Let this user access resource views.')
    .action(function () {
        const info = program.args[program.args.length-1];
        if (!info.email) {
            console.error('You must specify a value for --email.')
            process.exit(1);
        }
        let email = info.email;
        let isAdmin = !!info.admin;
        let licensed = !!info.licensed;
        let firstName = info.firstName || null;
        let lastName = info.lastName || null;
        let groupAdmin = !!info.groupAdmin;
        let resourceViewer = !!info.resourceViewer;
        user.add(email, isAdmin, licensed, firstName, lastName, groupAdmin, resourceViewer)
            .then(data => {
                console.log('User added:');
                user.display(data.result);
            })
            .catch(error => console.log(error));

    });

program
    .command('delete')
    .option('--user-id [id]', 'The ID of the user to be deleted. Required.')
    .option('--transfer-sheets', 'Transfer the user\'s sheets to another user.')
    .option('--transfer-to [id]', 'The ID of a user to whom group (and optionally sheet) ownership should be transferred.')
    .option('--remove-from-sharing', 'Remove the user from sharing within the organization.')
    .action(function () {
        const info = program.args[program.args.length-1];

        let force = !!info.parent.force;
        let userId = info.userId || null;
        let transferTo = info.transferTo || null;
        let transferSheets = !!info.transferSheets;
        let removeFromSharing = !!info.removeFromSharing;

        if (!userId) {
            console.error('The --user-id parameter is required.');
            process.exit(1);
        }
        if (transferSheets && !transferTo) {
            console.error('If --transfer-sheets is used, you must specify a new owner with --transfer-to.')
            process.exit(1);
        }

        if (force) {
            user.delete(userId, transferTo, transferSheets, removeFromSharing)
                .then (function (values) {
                    console.log('User deleted.');
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
        else {
            // Fetch some information about the user to be deleted and the
            // user taking over their sheets/groups.
            let toDelete = user.getInfo(userId);
            let replacement = user.getInfo(transferTo);
            Promise.all([toDelete, replacement])
                .then(function (values) {
                    [toastUser, replacementUser] = values;
                    // Confirm that this really is the correct user to delete.
                    let message = 'Do you really want to delete user ' + toastUser.email + ' (' + toastUser.id + ')';
                    if (transferTo) {
                        message += ' and transfer ownership of their ';
                        message += (transferSheets ? 'sheets and groups' : 'groups');
                        message += ' to ' + replacementUser.email;
                    }
                    message += '?';

                    let question = {
                        type: 'confirm',
                        name: 'proceed',
                        message: message,
                        default: false
                    };
                    inquirer.prompt([question]).then((answer) => {
                        if (answer.proceed) {
                            user.delete(userId, transferTo, transferSheets, removeFromSharing)
                                .then(() => {
                                    console.log('User deleted.')
                                    })
                                .catch(error => {console.error(error)});
                        }
                        else {
                            console.error('Delete cancelled.');
                            process.exit(1);
                        }
                    });
            }).catch(function (error) {
                console.log("Error:");
                console.error(error);
                process.exit(1);
            });
        }

    });

program
    .command('list')
    .option('--json', 'Display the results as raw JSON.')
    .option('-p, --page [#]', 'Which page of results to display.')
    .option('-s, --page-size [#]', 'How many records to return.')
    .option('-a, --include-all', 'Return all records, without pagination.')
    .action(function () {
        const info = program.args[program.args.length-1];
        let asJson = !!info.json;
        let pagination = {
            'pageSize': 10,
            'page': 1,
            'includeAll': false
        };
        if (info.page) {
            pagination.page = parseInt(info.page);
        }
        if (info.pageSize) {
            pagination.pageSize = parseInt(info.pageSize);
        }
        if (info.includeAll) {
            pagination.includeAll = true;
        }
        user.listUsers(pagination).then(function (results) {
            if (asJson) {
                console.log(results);
            }
            else {
                for (let i = 0; i < results.data.length; i++) {
                    let record = results.data[i];
                    user.display(record);
                }

                console.log(chalk.bold('Page %s of %s'), results.pageNumber, results.totalPages);
            }
        });
    });

program
    .parse(process.argv);
