const { body, validationResult } = require('express-validator');

// Book validation rules
const bookValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Author must be between 1 and 100 characters'),
    
    body('isbn')
      .optional()
      .trim()
      .isLength({ min: 10, max: 13 })
      .withMessage('ISBN must be between 10 and 13 characters')
      .matches(/^[0-9X-]+$/)
      .withMessage('ISBN can only contain numbers, X, and hyphens'),
    
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isLength({ min: 1, max: 50 })
      .withMessage('Category must be between 1 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    
    body('publishedYear')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Published year must be a valid year'),
    
    body('totalQuantity')
      .isInt({ min: 1, max: 1000 })
      .withMessage('Total quantity must be between 1 and 1000'),
    
    body('availableQuantity')
      .isInt({ min: 0 })
      .withMessage('Available quantity must be a non-negative number')
      .custom((value, { req }) => {
        if (value > req.body.totalQuantity) {
          throw new Error('Available quantity cannot exceed total quantity');
        }
        return true;
      }),
  ];
};

// User validation rules
const userValidationRules = () => {
  return [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 and 100 characters'),
    
    body('phoneNumber')
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]+$/)
      .withMessage('Phone number can only contain numbers, +, -, spaces, and parentheses')
      .isLength({ min: 10, max: 15 })
      .withMessage('Phone number must be between 10 and 15 characters'),
  ];
};

// Login validation rules
const loginValidationRules = () => {
  return [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ];
};

// Borrow validation rules
const borrowValidationRules = () => {
  return [
    body('bookId')
      .trim()
      .notEmpty()
      .withMessage('Book ID is required')
      .isMongoId()
      .withMessage('Invalid book ID format'),
    
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Due date must be in the future');
        }
        return true;
      }),
  ];
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  next();
};

module.exports = {
  bookValidationRules,
  userValidationRules,
  loginValidationRules,
  borrowValidationRules,
  validate
};
