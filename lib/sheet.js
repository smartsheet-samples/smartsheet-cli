const authenticate = require('./functions/authenticate.js');
var fs = require('fs');

module.exports = {
    createSheet : (sheetName) => {
        const gotAuth = authenticate.oAuth([]);
        Promise.all([gotAuth, ]).then((values) => {
        const smartsheet = values[0];

        const sheet = {
            "name": sheetName,
            "columns": [
                {
                    "title":"Test Column",
                    "type":"TEXT_NUMBER",
                    "primary":true
                }
            ]
        };
        const options = {
            body: sheet
        };
        smartsheet.sheets.createSheet(options)
            .then(function(newSheet) {
                console.log(newSheet);
            })
            .catch(function(error) {
                console.log(error);
            });
    })},

    getSheet : (sheetId, csvFlag, pdfFlag, excelFlag) => {
            const gotAuth = authenticate.oAuth([]);
            Promise.all([gotAuth, ]).then((values) => {
            const smartsheet = values[0];

            // Set options
            var options = {
                id: sheetId // Id of Sheet
            };

            // Get sheet
            if(!csvFlag && !pdfFlag && !excelFlag){
                smartsheet.sheets.getSheet(options)
                    .then(function(sheetInfo) {
                        console.log(sheetInfo);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
            if(csvFlag){
                // Get sheet
                smartsheet.sheets.getSheetAsCSV(options)
                    .then(function(fileContents) {
                        // Write sheet to file
                        fs.writeFile('output.csv', fileContents, (err) => {
                            if (err) throw err;
                            console.log('The CSV sheet has been saved!');
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
            if(pdfFlag){
                // Get sheet
                smartsheet.sheets.getSheetAsPDF(options)
                    .then(function(fileContents) {
                        // Write sheet to file
                        fs.writeFile('output.pdf', fileContents, 'binary', (err) => {
                            if (err) throw err;
                            console.log('The PDF sheet has been saved!');
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
            if(excelFlag){
                // Get sheet
                smartsheet.sheets.getSheetAsExcel(options)
                    .then(function(fileContents) {
                        // Write sheet to file
                        fs.writeFile('output.xlsx', fileContents, 'binary', (err) => {
                            if (err) throw err;
                            console.log('The Excel sheet has been saved!');
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
    })}
};