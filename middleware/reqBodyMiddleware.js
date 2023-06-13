const { validationResult } = require('express-validator');

module.exports = function validateRequestSchema(req, res, next) { //set validation
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }