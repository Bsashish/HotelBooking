const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room_types',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

const RoomsModal = mongoose.model('rooms', RoomsSchema);

module.exports = RoomsModal;
