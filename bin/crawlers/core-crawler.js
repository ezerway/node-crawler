const fs = require('fs');
const path = require("path");
const { DOWNLOADS_DICTIONARY_PATH } = require('dotenv').config().parsed;

export class CoreCrawler {
    async run() {

    }

    saveJsonFile(jsonObj, name) {
        return new Promise(resolve => {
            let jsonContent = JSON.stringify(jsonObj);
            fs.writeFile(DOWNLOADS_DICTIONARY_PATH + path.sep + name, jsonContent, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    console.log(err);
                    return resolve();
                }
                console.log("JSON file has been saved.");
                return resolve();
            });
        })
    }
}
