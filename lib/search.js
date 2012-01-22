var request = require('request'),
     stream = require('stream'),
       util = require('util'),
querystring = require('querystring'),
    cheerio = require('cheerio');


if(process.env['http_proxy']) request = request.defaults({ proxy: process.env['http_proxy']});

function SearchImage(){
  stream.Stream.call(this);
  this.readable = true;
  this.writable = true;
}

util.inherits(SearchImage, stream.Stream);

SearchImage.prototype.search = function(query){
  var self = this,
    url = 'http://images.google.com/search?tbm=isch&q=' + encodeURIComponent(query);

  request.get({
    url: url
  }, function(err, resp, html){
    if(err) return cb(err);
    $ = cheerio.load(html);
    var $link = $('#res img').parent();
    if(!$link) return self.emit('error', new Error('No image found for "' + query +'"'));

    var href = $link.attr('href');
    if(!href) return self.emit('error', new Error('No image found for "' + query +'"'));

    var linkParams = querystring.parse(href);
    var src = linkParams['/imgres?imgurl'];
    if(!src) return self.emit('error', new Error('No image found for "' + query +'"'));

    process.nextTick(function(){
      request.get({ url: src }).pipe(self);
    });
  });
}

SearchImage.prototype.write = function(chunk, encoding){
  this.emit('data', chunk);
}

SearchImage.prototype.end = function(chunk){
  this.emit('end', chunk);
}

function search(query){
  var s = new SearchImage();
  process.nextTick(function(){
    s.search(query);
  });
  return s;
}

module.exports = search;
