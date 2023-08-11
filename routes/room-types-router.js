const express = require('express');
const { validate } = require('express-validation');
const moment = require('moment/moment');
const BookingModal = require('../model/bookings');
const RoomsModal = require('../model/rooms');
const RoomTypesModal = require('../model/roomTypes');
const { roomTypeValidation } = require('../validations/room-types-validations');
const router = express.Router();

// Room types routes
router.get(
    '/room_types',
    (req, res) => {
        RoomTypesModal.find().then((data) => res.json(data))
    }
);

router.post(
    '/room_types',
    validate(roomTypeValidation),
    async (req, res) => {
        let response = await RoomTypesModal.create({
            name: req.body.name,
            status: true
        });
        res.json(response);
    }
);

router.put('/room_types/:id', async (req, res) => {
    let room_type = await RoomTypesModal.findById(req.params.id);
    if (!room_type)
        return res.json({ message: "Please use valid room type Id" });
    room_type.name = req.body.name;
    let response = await room_type.save();
    return res.json(response);
});

module.exports = router;
