const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrowerController');

// Add a new borrower
router.post('/', borrowerController.addBorrower);

// Update borrower details
router.put('/:id', borrowerController.updateBorrower);

// Borrow a book
router.post('/:borrowerId/borrow/:bookId', borrowerController.borrowBook);

// Return a book
router.post('/:borrowerId/return/:bookId', borrowerController.returnBook);

module.exports = router;
