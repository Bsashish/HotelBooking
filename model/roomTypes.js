const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomTypesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

const RoomTypesModal = mongoose.model('room_types', RoomTypesSchema);

module.exports = RoomTypesModal;