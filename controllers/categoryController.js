const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body, validationResult } = require('express-validator');
const { item_list } = require('./itemController');
const category = require('../models/category');


// Display detail page for a specific category.
exports.category_list_items = function(req, res, next) {
  
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id, callback);
    },
    category_items: function(callback) {
      Item
      .find({ category: req.params.id })
      .sort({ name: 1})
      .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
  
    res.render('category_items', {
      category: results.category,
      category_items: results.category_items
    });
  });
}


// Display list of all categorys.
exports.category_list = function(req, res) {
  Category.find({}, (err, categories) => {
    if (err) { return next(err); }

    res.render('category_list', {
      title: 'Categories',
      message: 'What kind of things are you looking for?',
      categories: categories
    });
  });
}


// Display category create form on GET.
exports.category_create_get = function(req, res, next) {
  res.render('category_form', {
    title: 'Create new category'
  });
}


// Handle category create on POST.
exports.category_create_post = [
  // Sanitize and validate form data from user.
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process after validation.
  (req, res, next) => {
    // Check for validation errors.
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    if (!errors.isEmpty()) {
      // There are errors, send back form with sanitized data.
      res.render('category_form', {
        title: 'Create new category - try again',
        errors: errors.array()
      });
    } else {
      // Check if categoy in database to avoid duplicates.
      Category.find({ name: req.body.name }, (err, docs) => {
        if (err) { return next(err); }
        if (docs.length > 0) {
          res.render('category_form', {
            title: 'Create new category - try again',
            error: 'This category already exists',
            category: category
          });
        } else {
          category.save((err) => {
            if (err) { return next(err); }
            
            // Successfully saved in db.
            res.redirect(category.url);
          });
        }
      });
    }
  }
]


// Display category update form on GET.
exports.category_update_get = function(req, res, next) {
  Category.findById(req.params.id, (err, category) => {
    if (err) { return next(err); }

    res.render('category_form', {
      title: 'Update Category',
      category: category
    });
  });
}


// Handle category update on POST.
exports.category_update_post = [

  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      // Send back form with sanitized user data.
      res.render('category_form', {
        title: 'Update category - try again',
        category: category,
        errors: errors.array()
      });
    } else {
      Category.findByIdAndUpdate(req.params.id, category, (err, updatedCat) => {
        if (err) { return next(err); }
        
        // Successfully updated the category.
        res.redirect(updatedCat.url);
      });
    }
  }
]


// Display category delete form on GET.
exports.category_delete_get = function(req, res, next) {
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id, callback);
    },
    category_items: function(callback) {
      Item.find({ category: req.params.id }, callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }

    if (results.category_items.length > 0) {

      // There are items that reference this category.
      res.render('category_delete', {
        title: 'Delete Category',
        category: results.category,
        category_items: results.category_items
      });
    } else {
      res.render('category_delete', {
        title: 'Delete Category',
        category: results.category
      });
    }
  });
}


// Handle category delete form on POST.
exports.category_delete_post = function(req, res) {
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id, callback);
    },
    category_items: function(callback) {
      Item.find({ category: req.params.id }, callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }

    if (results.category_items.length > 0) {

      // There are still items that reference this category.
      res.render('category_delete', {
        title: 'Delete Category',
        category: results.category,
        category_items: results.category_items
      });
    } else {
      // Its safe to delete category from the db.
      Category.findByIdAndRemove(req.params.id, (err) => {
        if (err) { return next(err); }
        
        // Successfully deleted.
        res.redirect('/inventory/categories');
      });
    }
  });
}
