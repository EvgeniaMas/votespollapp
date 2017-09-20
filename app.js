// Import basic modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// import multer
var multer  = require('multer');


// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');
// Import polls controller
var polls = require('./server/controllers/polls');


// ODM With Mongoose
var mongoose = require('mongoose');
// Modules to store session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// Database configuration
var config = require('./server/config/config.js');
// connect to our database
mongoose.Promise = global.Promise;

// function connectDatabase(databaseUri){
//     var promise = mongoose.connect(config.url, {
//         useMongoClient: true,
//     });
//     return promise;
// }


mongoose.connect(config.url);
// Check if MongoDB is running
mongoose.connection.on('error', function() {
	console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

// Passport configuration
require('./server/config/passport')(passport);

app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
// Setup public directory
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(session({
    secret: 'sometextgohere',
    saveUninitialized: true,
    resave: true,
    //store session on MongoDB using express-session + connect mongo
    store: new MongoStore({
        url: config.url,
        collection : 'sessions'
    })
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.route('./auth/twitter')
    .get(passport.authenticate('twitter'));

    app.route('./auth/twitter/callback')
    .get(passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }));
app.use(flash());

// Application Routes
// Index Route
app.get('/', index.show);
app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
    //Success go to Profile Page / Fail go to login page
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

app.get('/profile', auth.isLoggedIn, auth.list);

// Logout Page
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Setup routes for polls
app.get('/polls', polls.hasAuthorization, polls.list);
app.post('/polls', polls.hasAuthorization, polls.create);


// Setup routes for votes

app.get('/voting', polls.update);
app.get('/delete/:id', auth.delete);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
    
});
