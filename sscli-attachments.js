#!/usr/bin/env node
const attachments = require('./lib/attachments.js');
var program = require('commander');

program
    .command('list')
    .option('--sheet-id [id]', 'This is the name of your sheet')
    .action(function () {
        const info = program.args[program.args.length-1];
        attachments.listAttachments(info.sheetId);
    });

program
    .parse(process.argv);
