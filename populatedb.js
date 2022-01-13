#! /usr/bin/env node

console.log('This script populates the database, run with: $ node populatedb <your mongo connection string>');
// Original file from here: https://raw.githubusercontent.com/hamishwillee/express-locallibrary-tutorial/master/populatedb.js

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Category = require('./models/category');
const Item = require('./models/item');

/// Mongoose connection setup ///
const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];

/// My database functions ///
// #1.
function categoryCreate(name, description, cb) {
  const category = new Category({ name, description });

  category.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

// #2.
function itemCreate(name, description, category, price, stock, cb) {
  const item = new Item({
    name,
    description,
    category,
    price,
    stock
  });

  item.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    cb(null, item);
  });
}

/// My generation functions ///
// #1. 
function createCategories(cb) {
  async.series([
    function(callback) {
      categoryCreate('Weapons', 'An assortment of sharp and pointy metal implements. A tool for every job!', callback);
    }, 
    function(callback) {
      categoryCreate('Gear', 'An assortment of adventuring equipment.', callback);
    }
  ], cb);
}

// #2. 
function createItems(cb) {
  async.series([
    function(callback) {
      itemCreate('Sword', 'A one handed sword for hacking, slashing and stabbing. Newly sharpened.', categories[0], 15, 5, callback);
    }, 
    function(callback) {
      itemCreate('Crossbow', 'Its safer to do your killing from a distance!', categories[0], 20, 4, callback);
    }, 
    function(callback) {
      itemCreate('Rope', 'Climb mountains, span rivers, bind your enemies. Everyone needs some rope.', categories[1], 1, 20, callback);
    }, 
    function(callback) {
      itemCreate('Bedroll', 'For those long journeys between inns. Everyones gotta sleep.', categories[1], 1, 10, callback);
    }
  ], cb);
}

/// Call the generation functions ///
async.series([
  createCategories,
  createItems
],
// Optional callback
function(err, results) {
  if (err) {
    console.log('FINAL ERR: ' + err);
  }
  // All done, disconnect from database.
  mongoose.connection.close();
});
