var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

router.get('/', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll({ order: [["author", "ASC"]] });
  // console.log(books.map(book => book.toJSON()));
  res.render('index', { books, title: 'Books' });
}));

router.get('/new', asyncHandler(async (req, res, next) => {
  res.render('new-book', { title: 'New Book' });
}));


router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
      book = await Book.create(req.body);
      res.redirect("/books/");
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      console.log(book);
      res.render("new-book", { book , errors: error.errors, title: "New Book" });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    } 
  }
}));

module.exports = router;