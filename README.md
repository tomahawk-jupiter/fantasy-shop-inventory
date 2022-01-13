# Fantasy Shop Inventory App

## Skill Development for:

- Setting up routes
- Writing controllers for CRUD operations
- Using Pug view templates

<br>

## Additional Dependencies (not including the express-app-generator ones)

[mongoose](https://mongoosejs.com/), [dotenv](https://www.npmjs.com/package/dotenv), [async](https://caolan.github.io/async/v3/docs.html), [express-validator](https://express-validator.github.io/docs/index.html)

<br>

## Steps and Notes

1. **Generate boilderplate skeleton with [express-application-generator](https://expressjs.com/en/starter/generator.html)**

        $ npx express-generator --view=pug <project-name>
        $ npm install // cd to project first

2. **Install [mongoose](https://mongoosejs.com/) and setup connnection** [MDN tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#designing_the_locallibrary_models)

    This is done near the top of app.js.

    A dotenv module is used with a .env file to keep connection string private.

    **Create Shemas and models**

    Create models directory and files for each model. 
    
    Write the Schemas for category and item.

    Each model instance can be given a [virtual](https://mongoosejs.com/docs/tutorials/virtuals.html) with its url.

    Export the model at the bottom of the file.

3. **Populate database with populatedb.js script (re-write for your models)**

    [Original file](https://raw.githubusercontent.com/hamishwillee/express-locallibrary-tutorial/master/populatedb.js)

        $ npm install async // used by the script
        $ node populatedb <mongo_connection_string> // run the script

4. **Setup the routes [(MDN routes)](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes) and controllers (just responde with some text for now)**

    Create **routes/inventory.js**, this will be the module for the routes that are needed for the CRUD operations.

    In this module first import the Express application object, use it to create a Router object which can be used to setup the needed get and post routes which will contain the callback controllers.

    This router object is then exported and imported into the main app.js. Then call use() on the Express application to add the Router to the middleware handling path, specifying a URL.

    Create **controllers** directory and a file for **itemController.js** and **categoryController.js**. Write the callback controllers for each route, just respond with some text for now, the database queries and template views will be built up one at a time.

5. **Setup all of the 'READ' views (ie. view category and view item)**

    Find all and single database entries for categories and items, render the views and pass in the data.

    Write the pug views to display the data and create anchor elements to go to the specific items from the lists.

6. **Create all the forms and build out the controllers for the rest of the CRUD actions.**

    This is where [express-validator](https://express-validator.github.io/docs/index.html) needs to be installed and used to validate and sanitize the form data from the user.

        $ npm install express-validator

    ### Notes and trouble shooting

    <br>

    **validationResults object**

        const errors = validationResults(req);
    
    Remember you can log this object to see how its structured.

    Pass it into view like this:

        error: errors.array() // passes in an array, get message with error.msg when iterating through it.

    **model.find()**

    This query returns an array of docs, or an empty array. I ran into trouble when using it in an if statement condition, I was expecting a single doc or null.

    **Route order**

    `/category/create` must come before `/category/:id` or the :id route will trigger with a database error, this is because it will take `create` as a `:id` value.

7. **(optional) Figure out how to add and upload images for each item**

    Use this [middleware](https://github.com/expressjs/multer)

8. **(optional) Secret admin password to confirm deleting and updating**

## Questions?

1. **Sanitized data**

    How to convert sanitized data back to original value?
    
    Example:  
     An apostrophe in a string will be stored in an encoded format in the database when using the escape(). How to convert it back to a readable version when retrieving it from the db?