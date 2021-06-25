import {CoreCrawler} from "./core-crawler";

const Crawler = require('crawler');

const URL = 'https://themes.shopify.com';

export default class ShopifyThemeCrawler extends CoreCrawler{
    constructor() {
        super();
        this.themes = [];
        this.pageRequestCrawler = new Crawler({
            maxConnections: 10,
        });
    }
    async run() {
        await new Promise(resolve => {
            this.scanThemeListPage(URL + '/themes/?sort_by=popularity', resolve);
        })
        const promises =  this.themes.map(async (theme, index) => {
            this.themes[index].demo_link = await new Promise(resolve => {
                this.scanThemeDetailPage(theme.detail_link, resolve);
            });
        })
        await Promise.all(promises);
        await this.saveJsonFile(this.themes, 'shopify-theme.json');
    }
    scanThemeListPage(uri, resolve) {
        // Queue URLs with custom callbacks & parameters
        this.pageRequestCrawler.queue([{
            uri,
            callback: (error, res, done) => {
                if (error) {
                    console.log(error);
                    done();
                    return resolve();
                }
                const $ = res.$;
                let nexPageUrl = false;
                $('#Themes a').each((index, element) => {
                    if (element.attribs.class === 'next_page') {
                        nexPageUrl = URL + element.attribs.href;
                        return;
                    }
                    const href = element.attribs.href;
                    const detail_link = URL + href;
                    const name = element.attribs['data-trekkie-theme-handle'];
                    if (!name) {
                        return;
                    }
                    const theme_store_id = element.attribs['data-trekkie-theme-id'];
                    this.themes.push({ name, theme_store_id, detail_link })
                })
                if (!nexPageUrl) {
                    done();
                    return resolve();
                }
                done();
                this.scanThemeListPage(nexPageUrl, resolve)
            }
        }]);

    }
    scanThemeDetailPage(uri, resolve) {
        // Queue URLs with custom callbacks & parameters
        this.pageRequestCrawler.queue([{
            uri,
            callback: (error, res, done) => {
                if (error) {
                    console.log(error);
                    done();
                    return resolve();
                }
                const $ = res.$;
                let demo_link = false;
                $('.theme-ctas--tablet-up a[data-demo-url]').each((index, element) => {
                    demo_link = 'https://' + element.attribs['data-demo-url']
                })
                done();
                return resolve(demo_link);
            }
        }]);

    }
}
