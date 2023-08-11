const express = require('express');
const moment = require('moment/moment');
const BookingModal = require('../model/bookings');
const RoomsModal = require('../model/rooms');
const router = express.Router();


// Booking routes
router.get(
    '/booking',
    (req, res) => {
        BookingModal.find().populate({ path: 'room_Id', select: "_id name price type", populate: { path: 'type', modal: 'room_types', select: 'name' } }).then((data) => res.json(data))
    }
);

router.post(
    '/booking',
    async (req, res) => {
        const room = await RoomsModal.findById(req.body.room_Id);
        if (!room)
            return res.json({ message: "Please use valid room Id" });

        const bookingDates = await BookingModal.find().populate({ path: 'room_Id', select: "type", populate: { path: 'type', modal: 'room_types', select: 'name' } });
        let isValid = true;
        bookingDates.forEach((item) => {
            if (moment(req.body.from).utc().isSame(moment(item.from).utc()) && req.body.room_Id == item.room_Id._id) isValid = false;
        })
        if (!isValid) {
            res.status(422);
            return res.json({ message: "Room is already booked for selected dates" });
        }

        const days = moment(req.body.to).diff(moment(req.body.from), 'days');
        let response = await BookingModal.create({
            user_Id: req.user._id,
            room_Id: req.body.room_Id,
            from: moment(req.body.from).utc().toISOString(),
            to: moment(req.body.to).utc().toISOString(),
            price: (days ? days : 1) * room.price,
            status: true
        });
        res.json(response);
    }
);

router.put('/booking/:id', async (req, res) => {
    const room = await RoomsModal.findById(req.body.room_Id);
    if (!room)
        return res.json({ message: "Please use valid room Id" });

    const bookingDates = await BookingModal.find().populate({ path: 'room_Id', select: "type", populate: { path: 'type', modal: 'room_types', select: 'name' } });
    let isValid = true;
    bookingDates.forEach((item) => {
        if (moment(req.body.from).utc().isSame(moment(item.from).utc()) && req.body.room_Id == item.room_Id._id && req.params.id !== item._id) isValid = false;
    })
    if (!isValid) {
        return res.json({ message: "Room is already booked for selected dates" });
    }

    const days = moment(req.body.to).diff(moment(req.body.from), 'days');
    let booking = await BookingModal.findById(req.params.id);

    booking.user_Id = req.user._id;
    booking.room_Id = req.body.room_Id;
    booking.from = moment(req.body.from).utc().toISOString();
    booking.to = moment(req.body.to).utc().toISOString();
    booking.price = (days ? days : 1) * room.price;
    booking.status = true;

    booking = await booking.save();
    res.json(booking);
});

router.get(
    '/getBookedDates',
    async (req, res) => {
        let bookingDates = await BookingModal.find().populate({ path: 'room_Id', select: "type", populate: { path: 'type', modal: 'room_types', select: 'name' } })
        bookingDates = bookingDates.map((item) => {
            return {
                date: item.from,
                room_Id: item.room_Id._id
            }
        })
        return res.json(bookingDates);
    }
);

module.exports = router;
