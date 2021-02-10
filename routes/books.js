var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');

const pagination = require('../public/javascripts/pagination');
const search = require('../public/javascripts/search');

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

router.get('/', search(), pagination(), asyncHandler(async (req, res) => {
  res.render('index', {
    books: req.books, 
    title: "Books", 
    currentPage: 
    req.currentPage, 
    pages: req.pages, 
    term: req.term});
}));


router.get('/new', asyncHandler(async (req, res) => {
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
      res.render("new-book", { book , errors: error.errors, title: "New Book" });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    } 
  }
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render('update-book', {book, title: "Edit Book" });
  } else {
    const error = new Error('not Found');
    error.status = 404;
    throw error;
  }
}));

router.post('/:id', asyncHandler(async (req, res) => {
  let book; 
  try {
    book = await Book.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect('/books/');
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    if(error.name === "SequelizeValidationError"){
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title: "Update Book"});
    } else {
      throw error;
    }
  }
}));

router.post('/:id/delete', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
}))

module.exports = router;
