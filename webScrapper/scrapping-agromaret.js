var request = require('request');
var cheerio = require("cheerio");
var async     = require('async');
var mongoose = require('mongoose');
var EmailModel = require("./EmailModels");
var PhoneModel = require("./PhoneModels");

module.exports = function(job, success, error) {
    
async.waterfall([
    requestPage,
    cheerioScrape
  ], function (err, result) {

    if (err) {
      error(err);
    }
    console.log('done proses = '+ job.data.page);
    success(job);

  })

  function requestPage(callback) {

    var options = {
      url: 'http://agromaret.com/'+ job.data.page+'/agrokomplekskita',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36',
      }
    };

    request(options, function (err, response, body) {

      if (err) {
        console.log(err, _.result(response, 'statusCode'))
      }

      callback(null, body)
    })
  }

  function cheerioScrape(html, callback) {

    var $ = cheerio.load(html)

    var productCards = []
    
    //find userid
    var uid = $('.t_label_5.valign_cm').text();
        
    //find phone number in header userid
    var addressText = $('.t_label_4.valign_cm').text();
    var HP2 = addressText.match("08+[0-9]{9,}");
    var emails = [];
    
    
    //find email or phone number in list of email.
    var idx =0;
    $('.t_border_5').each(function(k,v){
        idx++;
        //console.log(idx);
        var textIklan = $(v).text();
        var email = textIklan.match("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}");
        if(email != null)
        {
            if(emails.indexOf(email[0]) == -1)
            {
                //console.log(email[0]);
                emails.push(email[0]);   
            }   
        }
    });
    
    for(var i =0; i < emails.length; i++)
    {
        var dataEmail = {
            name : uid,
            email : emails[i],
            fgpromote: false
        }
        var NewMail = new EmailModel(dataEmail);
        NewMail.save(function(err, newjob){
            if(err)
            {
                console.log(err);
            }
        })
    }
    
    if(HP2 != null)
    {
        var dataPhone = {
            name : uid,
            phone : HP2[0],
            fgpromote : false
        };
        var NewPhone = new PhoneModel(dataPhone);
        NewPhone.save(function(err, newjob){
            if(err)
            {
                console.log(err);
            }
        })
        //console.log(HP2);
    }
      callback(null);  
  }
}