// for (var index = 23013; index <=  30000; index++) {
//         require("./scrapping-agromaret_manual")(index);
// }

var querystring = require('querystring');
var http = require('http');

//109393
//20020
for (var index = 125001; index <= 130000; index++) {
    
    
    var data = JSON.stringify({	
        "type": "scraping",
        "data": {
            "page" : index
        },
        "options" : {
            "attempts": 5,
            "delay": 10000,
            "priority": "high"
        }
        });
    console.log(data);
    var options = {
        host: 'localhost',
        port: 4000,
        path: '/job',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
    });

    req.write(data);
    req.end();
    console.log("succes" + index);
}