const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require("cors");

mongoose.connect("mongodb://127.0.0.1:27017/hotel_mngmt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.log("Database not connected", err)
    } else {
        console.log("Database connected")
    }
});
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

require('./auth/auth');

const routes = require('./routes/routes');
const roomTypeRouter = require('./routes/room-types-router');
const roomsRouter = require('./routes/rooms-router');
const bookingRouter = require('./routes/booking-routes');
const { ValidationError } = require('express-validation');

const app = express();

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/', passport.authenticate('jwt', { session: false }), roomTypeRouter);
app.use('/', passport.authenticate('jwt', { session: false }), roomsRouter);
app.use('/', passport.authenticate('jwt', { session: false }), bookingRouter);

// Handle errors.
app.use(function (err, req, res, next) {
    let message;
    if (err instanceof ValidationError) {
        message = err.details.body[0].message
    } else {
        message = "Sometihng went wrong"
    }
    res.status(err.status || 500);
    res.json({ error: message });
});

app.listen(5000, () => {
    console.log('Server started.')
});