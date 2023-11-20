const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

app.use(express.static(__dirname));
// Adding css and js files from installed apps
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
//using bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

// This requires a folder called views
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(expressLayouts)
app.set('layout', './layouts/app-layout.ejs')


app.get('', (req, res) => {
    res.render("login-view.ejs")
});
app.get('/logged', (req, res) => {
    res.render("fst-view.ejs")
});

//handling logins check
app.post('/login', (req, res) => {
    const is_valid = true;
    if(is_valid){
        res.render("fst-view.js");
    }
});
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});