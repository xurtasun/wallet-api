var   express       = require('express')
      logger        = require('morgan')
      path          = require('path')
      cookieParser  = require('cookie-parser')
      bodyParser    = require('body-parser')
      mongoose      = require('mongoose')
      passport      = require('passport');
require('mongoose-middleware').initialize(mongoose);

//getting DB endpoint from env
var mongoDB = process.env.DB_HOST

var app = express();
var mongoConfig = {
    useNewUrlParser : true
};
//DB connection
mongoose.connect('mongodb://'+mongoDB+':27017/verse',mongoConfig);
console.log('DB_HOST',mongoDB);

//Enabling CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
//  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-access-token, access-control-allow-origin');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});
//Global config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes endpoints
require('./routes/users')(app);

// erro handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
