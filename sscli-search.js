#!/usr/bin/env node
const search = require('./lib/search.js');
var program = require('commander');

program
    .action(function() {
        const info = program.args[program.args.length-1];
        search.searchAll(info);
    });

program.parse(process.argv);
    