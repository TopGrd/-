#!/usr/bin/env node
var arg = process.argv.slice(2);
var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');
var request = require('request');
var page = 0;
/*var url = 'https://www.douban.com/photos/album/1625644808/';*/
var url = arg[0];
var urls = [];
urls[0] = url;
var options = {
    url: url,
    headers: {
        'User-Agent': 'request'
    }
};
console.log(arg);
request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        var a = $('.paginator').children('a').last()[0];
        var href = a.attribs.href;
        var arr = href.split('?'); //相册所有页
        var brr = arr[1].split('=');
        for (var i = 0; i < brr[1]; i += 18) {
            urls.push((url + '?start=' + i));
        }
    }
    for (var i in urls) {
        options.url = urls[i];
        request(options, callback);
    }
})

function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        $('.photo_wrap img').each(function(i, ele) {
            var src = ele.attribs.src + '';
            //从缩略图地址转向大图地址
            src = src.replace(/thumb/, 'photo');
            var filename = parseUrlForFileName(src);
            request.get(src).pipe(fs.createWriteStream('images/' + filename));
        })
    }
}