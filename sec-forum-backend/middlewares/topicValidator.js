const { body } = require('express-validator');

const topicValidator = [
    body('title')
        .trim()
        .escape()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 1, max: 200 }).withMessage('Content must be between 1 and 200 characters long'),  
];

module.exports = topicValidator;