
const joi = require("joi");

exports.roomTypeValidation = {
    body: joi.object({
        name: joi.string().required()
    })
}