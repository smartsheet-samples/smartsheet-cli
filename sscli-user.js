#!/usr/bin/env node
const user = require('./lib/user.js');
const program = require('commander');
const process = require('process');
const inquirer = require('inquirer');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

program
    .option('-f, --force', 'Skip any confirmation prompts.');

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
            let toDelete = user.getInfo(userId);
            let replacement = user.getInfo(transferTo);
            Promise.all([toDelete, replacement])
                .then(function (values) {
                    [toastUser, replacementUser] = values;
                    console.log(replacementUser);
                    // const toastUser = values[0];
                    // const replacementUser = values[1];

                    let message = 'Do you really want to delete user ' + toastUser.email + ' (' + toastUser.id + ')';
                    if (transferTo) {
                        message += ' and transfer ownership of their ';
                        message += (transferSheets ? 'sheets and groups' : 'groups');
                        message += ' to ' + replacement.email;
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
                            user.delete(userId, transferTo, transferSheets, removeFromSharing).then(() => {
                                console.log('User deleted.')
                            }).catch(error => {reject(error)});
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
    .action(function () {
        user.listUsers().then(data => console.log(data));
    });

program
    .parse(process.argv);
