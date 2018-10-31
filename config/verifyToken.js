var jwt = require('jsonwebtoken');
var config = require('../config/config');
// Function that checks if token auth is on request, and validates it
function verifyToken(req, res, next) {
    var token = req.headers['verse-access-token'];
    if (!token)
        return res.status(401).send({
            auth: false,
            message: 'No token provided.' // no token on request
        });
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
        return res.status(403).send({
            auth: false, message: 'Failed to authenticate token.' // token not authorized
        });
      // saving userId on request for using later
      req.userId = decoded.id;
      next();
    });
}
module.exports = verifyToken;
