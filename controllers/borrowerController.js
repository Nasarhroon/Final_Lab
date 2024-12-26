const Borrower = require('../models/borrower');
const Book = require('../models/book');

// Add a new borrower
exports.addBorrower = async (req, res) => {
  const { name, phoneNumber, membershipType, membershipActive } = req.body;

  try {
    const borrower = new Borrower({
      name,
      phoneNumber,
      membershipType,
      membershipActive,
      borrowedBooks: []
    });
    await borrower.save();
    res.status(201).json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update borrower details
exports.updateBorrower = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, membershipType, membershipActive } = req.body;

  try {
    const borrower = await Borrower.findByIdAndUpdate(id, {
      name,
      phoneNumber,
      membershipType,
      membershipActive
    }, { new: true });

    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.status(200).json(borrower);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
  const { borrowerId, bookId } = req.params;

  try {
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!book || book.availableCopies === 0) {
      return res.status(400).json({ message: 'No available copies of the book to borrow.' });
    }

    if (borrower.membershipType === 'Standard' && borrower.borrowedBooks.length >= 5) {
      return res.status(400).json({ message: 'Borrow limit exceeded for Standard membership.' });
    }
    if (borrower.membershipType === 'Premium' && borrower.borrowedBooks.length >= 10) {
      return res.status(400).json({ message: 'Borrow limit exceeded for Premium membership.' });
    }

    borrower.borrowedBooks.push(bookId);
    book.availableCopies -= 1;
    await borrower.save();
    await book.save();

    res.status(200).json({ message: 'Book borrowed successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Return a borrowed book
exports.returnBook = async (req, res) => {
  const { borrowerId, bookId } = req.params;

  try {
    const borrower = await Borrower.findById(borrowerId);
    const book = await Book.findById(bookId);

    if (!borrower.borrowedBooks.includes(bookId)) {
      return res.status(400).json({ message: 'The book was not borrowed by this borrower.' });
    }

    borrower.borrowedBooks = borrower.borrowedBooks.filter(id => id.toString() !== bookId);
    book.availableCopies += 1;

    await borrower.save();
    await book.save();

    res.status(200).json({ message: 'Book returned successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
