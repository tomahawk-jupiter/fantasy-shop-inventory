const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true , maxLength: 20 },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
  }
);
// NOTE - the appropriate category id will be got when the user submits the form-
// the options for which are retrieved grom the db and passed into the pug view. 

// Give each item a unique URL using its _id.
// Virtual fields aren't stored in the databse.
ItemSchema
.virtual('url')
.get(function() {
  return '/inventory/item/' + this._id;
});

// Export the model.
module.exports = mongoose.model('Item', ItemSchema);