#!/usr/bin/env node
const auth = require('./lib/auth.js');
const program = require('commander');

program
    .command('login')
    .action(function() {
        auth.login(() => {
            // process.exit();
        });
    });

program
    .command('logout')
    // options arent getting passed corrrectly with the way auth.js is structured
    .description('Removes your Smartsheet access token.')
    .action(function() {
        auth.logout();
    });

program
    .parse(process.argv);
