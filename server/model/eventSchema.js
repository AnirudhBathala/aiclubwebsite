const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    url:{
        type: String,
        required:true
    },
    speakers:[{
        type: String,
        required:true
    }],
    poster:{
        type: String,
        required:true
    },
    abstract:{
        type: String,
        required:true
    },
    duration:{
        type: String,
        required:true
    },
    eventSchedule:{
        type:Date,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
});

const Events = mongoose.model('Event',eventSchema)
module.exports = Events;