
const Book = require('../models/book');
const Author = require('../models/author');

// Get all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new author
exports.addAuthor = async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  try {
    const author = new Author({
      name,
      email,
      phoneNumber
    });
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an author
exports.updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber } = req.body;

  try {
    const author = await Author.findByIdAndUpdate(id, { name, email, phoneNumber }, { new: true });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


