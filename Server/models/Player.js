const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    nickname: {
        type: String,
        trim: true,
    },
    socketID: {
        type:String
    },
    isPartyLeader: {
        type: Boolean,
        default: false
    },
    points: {
        //type: [],
        type: Number,
        //type: 'Path',
        //type: Number,
        default: 0,
    }
})

const playerModel = mongoose.model('player', playerSchema);
module.exports = {playerModel, playerSchema};