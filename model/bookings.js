const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    room_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

const BookingModal = mongoose.model('booking', BookingSchema);

module.exports = BookingModal;
