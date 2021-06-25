#!/usr/bin/env node

const yargs = require("yargs");
const path = require("path");

const options = yargs
 .usage("Usage: -c <crawler>")
 .option("c", { alias: "crawler", describe: "Crawler name, eg: shopify-theme", type: "string", demandOption: true })
 .argv;

try {
    const crawlerPath = '.' + path.sep + path.join('crawlers' , options.crawler + '-crawler');
    const Crawler = require(crawlerPath).default;
    const crawler = new Crawler();
    crawler.run();
} catch (e) {
    console.log(e);
}

