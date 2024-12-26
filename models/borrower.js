const mongoose = require('mongoose');

// Borrower Schema
const borrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number (10 digits)'] // Adjust if you want more formats
  },
  membershipType: {
    type: String,
    required: true,
    enum: ['Standard', 'Premium']
  },
  borrowedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  membershipActive: {
    type: Boolean,
    required: true
  }
});

// Validation for borrowing limit
borrowerSchema.pre('save', function (next) {
  if (this.membershipType === 'Standard' && this.borrowedBooks.length > 5) {
    return next(new Error('Standard members can only borrow up to 5 books.'));
  }
  if (this.membershipType === 'Premium' && this.borrowedBooks.length > 10) {
    return next(new Error('Premium members can only borrow up to 10 books.'));
  }
  next();
});

// Borrower Model
const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
