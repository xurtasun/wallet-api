var User = require('../models/users')

//function that check if user has enough balance
function verifySaldo(req, res, next) {
    User.findOne({
        _id     : req.userId,
        balance : { 
            $gte : req.body.money 
        }
    },function(err,user){
        if (!user)
            return res.status(403).send({
                message : 'Not enough balance to make this transaction.'
            });
        next();
    });
}
module.exports = verifySaldo;
