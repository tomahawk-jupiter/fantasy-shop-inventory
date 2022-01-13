const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
const { body, validationResult } = require('express-validator');


// Display home page for inventory.
exports.index = function(req, res) {
  res.render('index');
}


// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: Item detail');
  Item.findById(req.params.id, function(err, item) {
    if (err) { return next(err); }

    res.render('item_detail', {
      item: item
    });
  });
}


// Display list of all items.
exports.item_list = function(req, res, next) {
  Item.find({}, 'name')
    .sort({ 'name': 1})
    .exec((err, items) => {
      if (err) { return next(err); }

      res.render('item_list', {
        title: 'Items',
        message: 'Take your time, something for everyone...',
        items: items
      });
  });
}


// Display item create form on GET.
exports.item_create_get = function(req, res, next) {

  // Get the categories from db for the form-
  // they are needed for the options in the select element.
  Category.find(function(err, categories) {
    if (err) { return next(err); }

    res.render('item_form', {
      title: 'Create new item',
      categories: categories
    });
  });
}


// Handle item create on POST.
exports.item_create_post = [

  // validate and sanitize fields.
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Category must be selected')
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .isNumeric()
    .escape(),
  body('stock', 'Stock must not be empty')
    .trim()
    .isNumeric()
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create item object with escaped and trimmed data.
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock
    });

    if (!errors.isEmpty()) {
      // If there are any validation errors. 
      // Render form with sanitized data and error messages.
      Category.find((err, categories) => {
        if (err) { return next(err); }

        res.render('item_form', {
          title: 'Create new item - try again',
          categories: categories,
          item: newItem,
          errors: errors.array()
        });
      });
    } else {
      Item.find({ name: req.body.name }, (err, item) => {
        if (err) { return next(err); }

        if (item.length < 1) {
          newItem.save((err) => {
            if (err) { return next(err); }

            // Successfully saved item to db.
            res.redirect(newItem.url);
          });
        } else {
          Category.find((err, categories) => {
            if (err) { return next(err); }
            res.render('item_form', {
              title: 'Create new item',
              categories: categories,
              item: newItem,
              error: 'This item name is already used'
            });
          });

        }
      });
    }
  }
]


// Display item update form on GET.
exports.item_update_get = function(req, res, next) {

  async.parallel({
    item: function(callback) {
      Item.findById(req.params.id, callback);
    },
    categories: function(callback) {
      Category.find({}, callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }

    res.render('item_form', {
      title: 'Update Item',
      categories: results.categories,
      item: results.item
    });
  });
}


// Handle item update on POST.
exports.item_update_post = [
  // validate and sanitize fields.
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Category must be selected')
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .isNumeric()
    .escape(),
  body('stock', 'Stock must not be empty')
    .trim()
    .isNumeric()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {

      Category.find({}, (err, categories) => {
        if (err) { return next(err); }

        res.render('item_form', {
          title: 'Update Item - try again',
          categories: categories,
          item: item,
          errors: errors.array()
        });
      });
    } else {
      Item.findByIdAndUpdate(
        req.params.id, item, (err, updatedItem) => {
          if (err) { return next(err); }

          res.redirect(updatedItem.url);
      });
    }
  }
]


// Display item delete form on GET.
exports.item_delete_get = function(req, res, next) {
  Item.findById(req.params.id, (err, item) => {
    if (err) { return next(err); }
    if (!item) {
      res.redirect('/inventory/items');
    }
    res.render('item_delete', {
      title: 'Delete Item',
      item: item
    });
  });
}


// Handle item delete on POST.
exports.item_delete_post = function(req, res) {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) { return next(err); }

    // Successfully deleted.
    res.redirect('/inventory/items');
  });
}
