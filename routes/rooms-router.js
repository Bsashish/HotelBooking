const express = require('express');
const moment = require('moment/moment');
const BookingModal = require('../model/bookings');
const RoomsModal = require('../model/rooms');
const RoomTypesModal = require('../model/roomTypes');
const router = express.Router();

// Rooms routes
router.get(
    '/rooms',
    (req, res) => {
        RoomsModal.find().populate({ path: 'type', select: "_id name" }).then((data) => res.json(data))
    }
);

router.post(
    '/rooms',
    async (req, res) => {
        let response = await RoomsModal.create({
            name: req.body.name,
            type: req.body.type,
            price: req.body.price,
            status: true
        });
        res.json(response);
    }
);

router.put('/rooms/:id', async (req, res) => {
    let rooms = await RoomsModal.findById(req.params.id);
    if (!rooms)
        return res.json({ message: "Please use valid room Id" });
    rooms.name = req.body.name;
    rooms.type = req.body.type;
    rooms.price = req.body.price;
    rooms.status = true;
    let response = await rooms.save();
    return res.json(response);
});

module.exports = router;
