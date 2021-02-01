var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

  if(books.length > 10) {
    res.redirect('/books/page/1')
  } else {
    res.render('index', { books , title: 'Books' });
  }
}));

router.get('/page/:page', asyncHandler(async(req,res,next) => {
  const numberOfBooks = await Book.count();
  const perPage = 10;
  const pages = Math.ceil(numberOfBooks / perPage);
  const currentPage = parseInt(req.params.page);
  const offset = parseInt(req.params.page) * perPage - perPage;
  const books = await Book.findAll({offset, limit: perPage});
  if (books.length > 0){
    res.render('index', {books, title: "Books", currentPage, pages});
  } else {
    const error = new Error('not Found');
    error.status = 404;
    throw error;
  }
}));

router.get('/new', asyncHandler(async (req, res, next) => {
  res.render('new-book', { title: 'New Book' });
}));

router.get('/search', asyncHandler(async (req,res,next) => {
  const { term } = req.query;
  const books = await Book.findAll({ 
    where: {
      [Op.or]: [
        {title: {
          [Op.like]: '%' + term + '%'
        }},
        {author: {
          [Op.like]: '%' + term + '%'
        }},
        {genre: {
          [Op.like]: '%' + term + '%'
        }},
        {year: {
          [Op.like]: '%' + term + '%'
        }}
      ]
    }
  });
  if(term === ''){
    res.redirect('/books');
  } else {
    res.render('index', { books });
  }
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
