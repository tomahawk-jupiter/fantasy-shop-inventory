const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Schema.
const CategorySchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 20 },
    description: { type: String, required: true }
  }
);

// Virtual field to give a unique URL to each category document.
// Virtual fields aren't stored in the databse.
CategorySchema
.virtual('url')
.get(function() {
  return '/inventory/category/' + this._id;
});

// Export the model
module.exports = mongoose.model('Category', CategorySchema);