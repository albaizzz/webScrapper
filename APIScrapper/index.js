var httpRequest = require("./modules/httpRequest");
var mongoose = require("mongoose");

require("./models/db");
var UserMaster = mongoose.model("User");

var maxusers = 116926;
var counting = 70642;

function request() {
    var maxCounting = (counting < maxusers ? counting + 20 : maxusers);
    for (counting; counting <= maxCounting; counting++) {
        httpRequest.get("/detail/get-seller-info", { sellerId: counting }, function (data) {
            var userMaster = new UserMaster();
            for (k in data) {
                userMaster[k] = data[k];
            }

            userMaster.save(function (err) {
                if (err)
                    return next(err);
            });
        });
        console.log("Success = " + counting);
    }
}
setInterval(request, 1000);
// for (var i = 0; i <= maxusers; i++) {
//     httpRequest.get("/detail/get-seller-info", { sellerId: i }, function(data) {
//         var userMaster = new UserMaster();
//         for (k in data) {
//             userMaster[k] = data[k];
//         }

//         userMaster.save(function(err) {
//             if (err)
//                 return next(err);
//         });
//     })
// }