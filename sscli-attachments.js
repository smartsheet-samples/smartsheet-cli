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
    .command('upload')
    .option('--sheet-id [id]', 'This is the id of your sheet')
    .option('--comment-id [id]', 'This is the id of your comment')
    .option('--row-id [id]', 'This is the id of your row')
    .option('--file [file]', 'This is the file you wish to upload')
    .action(function () {
        const info = program.args[program.args.length-1];
        attachments.uploadAttachment(info.sheetId, info.commentId, info.rowId, info.file);
    })

program
    .parse(process.argv);
