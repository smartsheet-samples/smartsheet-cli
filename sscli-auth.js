#!/usr/bin/env node
const auth = require('./lib/auth.js');
var program = require('commander');

program
    .command('login')
    .action(function() {
        auth.gotAuth();
    });