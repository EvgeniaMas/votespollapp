// get gravatar icon from email
// var gravatar = require('gravatar');
// get pools model
var Polls = require('../models/polls');

// List polls
exports.list = function(req, res) {
	// List all comments and sort by Date
    Polls.find().sort('-created').populate('user', 'local.name').exec(function(error, polls) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }


        // Render result
        res.render('polls', {
            title: 'Polls',
            polls: polls,           
            user : req.user
            
        });
    });
};
// Create polls
exports.create = function(req, res) {
	// create a new instance of the Comments model with request body
    var polls = new Polls(req.body);
    // Set current user (id)
    polls.user = req.user;
    // save the data received
    polls.save(function(error) {
        if (error) {Polls
            return res.send(400, {
                message: error
            });
        }
        // Redirect to comments
        res.redirect('/polls');
    });
};

exports.delete = function(req, res) {
   
Polls.findByIdAndRemove(req.query.id, function(err){
            if (err) throw err;
            res.redirect('/login');
        });    
};

exports.update = function(req, res) { 
   
    if (req.query.value == 1) {
   Polls.findByIdAndUpdate(req.query.id, {$inc: { votes1: 1}} , function(err){
        if (err) throw err;
       
        res.redirect('/polls');
    });
   }
    else if (req.query.value == 2) {
   Polls.findByIdAndUpdate(req.query.id, {$inc: { votes2: 1}} , function(err){
        if (err) throw err;
       
        res.redirect('/polls');
    });
   }
      else if(req.query.value == 3) {
   Polls.findByIdAndUpdate(req.query.id, {$inc: { votes3: 1}} , function(err){
        if (err) throw err;
       
        res.redirect('/polls');
    });
   }
      else if (req.query.value == 4) {
   Polls.findByIdAndUpdate(req.query.id, {$inc: { votes4: 1}} , function(err){
        if (err) throw err;
        
        res.redirect('/polls');
    });
   }
};


// Polls authorization middleware
exports.hasAuthorization = function(req, res, next) {
	if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
