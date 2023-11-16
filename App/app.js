const express = require('express'); //Import the express dependency
const path = require('path')
const expressLayouts = require('express-ejs-layouts') // Import express layouts
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 3000;


//serving public file
app.use(express.static(__dirname));


// Adding css and js files from installed apps
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
//using bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
//using jquery
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));


// This requires a folder called views
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(expressLayouts);
app.set('layout', './layouts/base-layout.ejs');

//all routes to set as 'body' which is the current view globally
app.get('', (req, res) => {
    res.render("first-view.ejs")
})


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});