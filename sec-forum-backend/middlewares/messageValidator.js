const { body } = require('express-validator');

const messageValidator = [
    body('content')
        .trim()
        .escape()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 1, max: 500 }).withMessage('Content must be between 1 and 500 characters long'),  
];

module.exports = messageValidator;