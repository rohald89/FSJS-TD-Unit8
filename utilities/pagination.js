
const url = require('url');   

function pagination(){
    return async (req, res, next) => {
      const books = req.books;
      const numberOfBooks = req.books.length;
      const perPage = 5;
      const pages = Math.ceil(numberOfBooks / perPage);
      const currentPage = parseInt(req.query.page);
      const endIndex = currentPage * perPage;
      const offset = parseInt(req.query.page) * perPage - perPage;
      const bookRange = books.slice(offset, endIndex);
      if(currentPage > pages){
        const error = new Error('The page you are looking for can not be found');
        error.status = 404;
        next(error);
      }
      if(!req.query.page) {
        res.redirect(url.format({
          pathname:"/books",
          query: {
             "page": 1,
             "term": req.term
           }
        }));
      }
      if (bookRange.length > 0){
        req.pages = pages;
        req.currentPage = currentPage;
        req.books = bookRange;
        next();
      } else {
        const error = new Error('not Found');
        error.status = 404;
        throw error;
      }
    }
  }

  module.exports = pagination;