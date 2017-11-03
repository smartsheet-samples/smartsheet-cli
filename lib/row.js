const authenticate = require('./functions/authenticate.js');
const path = require('path');
const fs = require('fs')
const fse = require('fs-extra')

module.exports = {
    addRows : (sheetId, inputFilePath, outputFilePath, enableStdout) => {
        const gotAuth = authenticate([]);
        Promise.all([gotAuth, ])
            .then((values) => {
                const smartsheet = values[0];

                fse.readJson(inputFilePath, 'utf8', (errReadInputFile, inputRowsJson) => {
                    if (errReadInputFile) throw errReadInputFile;

                    const options = {
                        sheetId: sheetId,
                        body: inputRowsJson
                    };
                    smartsheet.sheets.addRows(options)
                        .then(function(newRows) {
                            if (outputFilePath) {
                                fse.writeJson(outputFilePath, newRows, {spaces:2}, (fileErr) => { if (fileErr) throw fileErr; });
                            }
                            if (!outputFilePath || enableStdout) {
                                process.stdout.write(JSON.stringify(newRows, null, 2));
                            }
                        })
                        .catch(function(apiError) {
                            process.stderr.write(JSON.stringify(apiError, null, 2));
                            throw apiError;
                        });

                });
            }
    )},

    getRows : (sheetId, rowIds, outputFilePath, enableStdout) => {
        const gotAuth = authenticate([]);
        Promise.all([gotAuth, ])
            .then((values) => {
                const smartsheet = values[0];
                const options = {
                    id: sheetId,
                    queryParameters: {rowIds: rowIds}
                };

                smartsheet.sheets.getSheet(options)
                    .then(function(sheetInfo) {
                        if (outputFilePath) {
                            fse.writeJson(outputFilePath, sheetInfo.rows, {spaces:2}, (fileErr) => { if (fileErr) throw fileErr; });
                        }
                        if (!outputFilePath || enableStdout) {
                            process.stdout.write(JSON.stringify(sheetInfo.rows, null, 2));
                        }
                    })
                    .catch(function(apiError) {
                        process.stderr.write(JSON.stringify(apiError, null, 2));
                        throw apiError;
                    });
            })
    }
};

