const express = require('express');
const router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');


/// ITEM ROUTES ///

// GET inventory home page.
router.get('/', item_controller.index);

// GET request for creating an Item.
router.get('/item/create', item_controller.item_create_get);

// POST request for creating an Item.
router.post('/item/create', item_controller.item_create_post);

// GET request for deleting an Item.
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request for deleting an Item.
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update an Item.
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update an Item.
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for a single Item.
router.get('/item/:id', item_controller.item_detail);

// GET request for a list of all Items.
router.get('/items', item_controller.item_list);


/// CATEGORY ROUTES ///

// GET create category
router.get('/category/create', category_controller.category_create_get);

// POST create category
router.post('/category/create', category_controller.category_create_post);

// GET update category
router.get('/category/:id/update', category_controller.category_update_get);

// POST update category
router.post('/category/:id/update', category_controller.category_update_post);

// GET delete category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST delete category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET single category
router.get('/category/:id', category_controller.category_list_items);

// GET all categories
router.get('/categories', category_controller.category_list);

module.exports = router;