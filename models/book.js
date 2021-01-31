'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Sequelize.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: {
          msg: "Please fill in a title."
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: {
          msg: "Please fill in the author name."
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize
  });
  return Book;
};