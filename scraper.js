var accountSid = SECRET;
var authToken = SECRET;

var fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio'),
  prompt = require('prompt'),
  client = require('twilio')(accountSid, authToken);

var mins = 60,
  the_interval = mins * 60 * 1000


setInterval(function() {
  url = 'http://www.amazon.co.uk/gp/product/1118531647';

  request(url, function(error, response, html) {
    console.log(html);
    var price;
    var json = {
      price: ""
    };
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $('.inlineBlock-display span.a-color-price').each(function(i, element) {
        var a = $(this);
        var price = a.text();

        //require the Twilio module and create a REST client 
        var client = require('twilio')(accountSid, authToken);
        json.price = price;

        fs.readFile('price.json', function(err, data) {
          if (err) throw err;
          var obj = JSON.parse(data);
          if (obj.price != price) {
            console.log('Price has changed sending text!');
            client.messages.create({
              from: SECRET,
              to: SECRET,
              body: "The price has changed to: " + price + " from " + obj.price
            })
            fs.writeFile('price.json', JSON.stringify(json, null, 4), function(err) {
              console.log('Price saved in price.json file');
            });
          }
        })
      })
    }
  });

}, the_interval);