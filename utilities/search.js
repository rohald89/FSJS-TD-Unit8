const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function search() {
    return async (req, res, next) => {
      let books;
      if (req.query.term){
        console.log('THERE HAS BEEN A SEARCH WITH THE TERM: ' + req.query.term)
        const { term } = req.query;
        books = await Book.findAll({ 
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
      } else {
        books = await Book.findAll({ order: [["author", "ASC"]] });
      }
      if (books.length === 0){
        const error = new Error('Your search does not have any results');
        error.status = 404;
        next(error);
      } else {
        req.books = books;
        req.term = req.query.term;
        next();
      }    
    }
  }


  module.exports = search;
