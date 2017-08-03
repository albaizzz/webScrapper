var mongoose = require("mongoose");
var Phone = new mongoose.Schema({
    name : {
        type : String,
        index : true, 
        require : true,
    },
    phone : {
        type : String
    },
    fgpromote : {
        type : Boolean
    }
});


Phone.plugin(require("mongoose-timestamp"));
var PhoneModel = mongoose.model("Phone", Phone);
module.exports = PhoneModel;