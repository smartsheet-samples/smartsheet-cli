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
    .command('get')
    .option('--sheet-id [id]', 'This is the name of your sheet')
    .option('--attachment-id [attachmentId]', 'This is the id of the attachment you want')
    .action(function () {
        const info = program.args[program.args.length-1];
        attachments.getAttachment(info.sheetId, info.attachmentId);
    })

program
    .parse(process.argv);
