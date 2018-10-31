var mongoose = require('mongoose');

// Every Transaction is registered on each user
var transactionSchema = mongoose.Schema({
    from         : { type: String, required: true},
    to           : { type: String, required: true},
    money        : { type: Number, required: true},
    created_at   : { type: Date, default: Date.now },
    updated_at   : { type: Date, default: Date.now }
});

//User schema definition with default values
var userSchema = mongoose.Schema({
    userName     : { type: String, required: true},
    email        : { type: String, required: true, unique: true },
    name         : { 
        first    : { type: String, required: true },
        last     : { type: String, required: true }
    },
    passwd       : { type: String, required: true }, 
    transactions : [transactionSchema],
    balance      : { type: Number, required: true, default: 10}, 
    currency     : { type: String, required: true, default: 'EUR'},
    created_at   : { type: Date, default: Date.now },
    updated_at   : { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);
