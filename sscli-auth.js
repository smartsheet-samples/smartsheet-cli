#!/usr/bin/env node
const auth = require('./lib/auth.js');
const program = require('commander');

program
    .command('login')
    .action(function() {
        console.log(" i'm calling login ");
        auth.login();
    });

program
    .command('logout')
    // options arent getting passed corrrectly with the way auth.js is structured
    .option('-f, --force', 'Force logout')
    .description('Removes your Smartsheet access token.')
    .action(function() {
        console.log("i'm calling logout")
        auth.logout();
    });

program
    .parse(process.argv);
