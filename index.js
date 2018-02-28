var request = require("request");
// var $ = require("jquery");
var cheer = require('cheerio');
var lodash = require('lodash');



var urls = [];
var newUrls = [];
var txt = "";
request("http://www.23us.so/files/article/html/14/14056/index.html", function (error, response, body) {

    var $ = cheer.load(body);
    var dd = $('#at td a');
    console.log(lodash);
    dd.each((item, element) => {
        urls.push({
            index: item,
            title: element.children.length ? element.children[0].data : '',
            href: element.attribs.href,
            hasLoad: false,
            text: '',
        });
    });


    if (urls.length) {
        urls = lodash.take(urls, 5);
        urls.forEach((item, index) => request(item.href, function (error, response, childBody) {
            console.log("开始下载了第" + index + "章节");
            var child = cheer.load(childBody);
            var context = child('#contents');
            var found = urls.filter((item) => {
                return item.index == index;
            })
            if (found) {
                found[0].text = context.text();
                found[0].hasLoad = true;
            }
            newUrls.push(found);
            // var allFilled = lodash.every(newUrls, ['hasLoad', true]);
            if (newUrls.length == urls.length) {
                var ss = lodash.orderBy(newUrls, ['index']);

            }

        }));
    }
});