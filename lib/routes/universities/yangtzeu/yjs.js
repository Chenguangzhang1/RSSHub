const axios = require('@/utils/axios');
const cheerio = require('cheerio');
const url = require('url').resolve;

module.exports = async (ctx) => {
    const link = 'http://yjsc.yangtzeu.edu.cn/';
    const response = await axios.get(link);
    const $ = cheerio.load(response.data);
    const list = $('.N02_list li dl').slice(0, 10);

    ctx.state.data = {
        title: '长江大学研究生院',
        link: link,
        description: '长江大学研究生院新闻',
        item:
            list &&
            list
                .map((index, item) => {
                    item = $(item);
                    const day = item.find('.N02_list_Icon i').text();
                    item.find('.N02_list_Icon')
                        .find('i')
                        .remove();
                    const year_month = item.find('.N02_list_Icon').text();
                    return {
                        title: item.find('h4 a').text(),
                        description: item.find('dd p').text() || '长江大学研究生院新闻',
                        pubDate: new Date(year_month + ' ' + day).toUTCString(),
                        link: url(link, item.find('h4 a').attr('href')),
                    };
                })
                .get(),
    };
}
