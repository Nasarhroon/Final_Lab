const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks); // Fetch all books
router.post('/', bookController.addBook); // Add a new book
router.put('/:id', bookController.updateBook); // Update a book by ID
router.delete('/:id', bookController.deleteBook); // Delete a book by ID

module.exports = router;
