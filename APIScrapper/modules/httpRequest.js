var http = require("http"),
    querystring = require('querystring');

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

module.exports.get = function(endpoint, data, success) {


    if (!isEmptyObject(data)) {
        endpoint += '?' + querystring.stringify(data);
    }

    var options = {
        proxy: { ip: '210.57.214.46', port: 3128 },
        host: "agromaret.com",
        path: endpoint,
        method: "GET"
    };
    // host: "220.249.185.178", port: 9797,
    http.get(options, (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error(`Request Failed.\n` +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            if (!/^text\/html/.test(contentType)) {
                error = new Error(`Invalid content-type.\n` +
                    `Expected application/json but received ${contentType}`);
            }
        }
        if (error) {
            console.log(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                // console.log(parsedData);
                success(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
}

module.exports.post = function(endpoint, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};


    headers = {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    };

    var options = {
        host: "http://agromaret.com/",
        path: endpoint,
        method: "POST",
        headers: headers
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log(responseString);
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    });

    req.write(dataString);
    req.end();
}