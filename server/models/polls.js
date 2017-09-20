// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollsSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Theme cannot be blank'
    },
    answer1: {
        type: String,
        default: '',
        trim: true
    },

    answer2: {
        type: String,
        default: '',
        trim: true
    },

    answer3: {
        type: String,
        default: '',
        trim: true
    },

    answer4: {
        type: String,
        default: '',
        trim: true,        
    },

    votes1: {
           type: Number,
            default: 0, 
        },

    votes2: {
           type: Number,
            default: 0, 
        },

    votes3: {
           type: Number,
            default: 0, 
    },

    votes4: {
           type: Number,
            default: 0, 
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Polls', pollsSchema);
