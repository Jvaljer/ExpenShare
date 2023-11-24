const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

const fs = require('fs');
const bodyParser = require ( 'body-parser');
app.use (bodyParser.urlencoded()) ;

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
    res.render("login-view.ejs", {start:true, fail:false});
});

app.post('/login', (req, res) => {
    //here we would load all datas
    const username = req.body.username;
    const password = req.body.password;
    const raw = fs.readFileSync("data/logs.json");
    const data = JSON.parse(raw);
    const logs = data["logins"];

    for(var i=0; i<logs.length; i++){
        console.log(logs[i][0]+','+logs[i][1]);
        if(logs[i][0]===username && logs[i][1]===password){
            //here we wanna load the user from another JSON file
            const raw = fs.readFileSync("data/users.json");
            const data = JSON.parse(raw);
            const users = data["users"];
            for(var i=0; i<users.length; i++){
                if(users[i][0]===username){
                    res.render("fst-view.ejs", {
                        user: users[i]
                    });
                }
            }
        }
    }
    res.render("login-view.ejs",{
        start: false,
        fail: true
    });
});
app.post('/log', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Read the existing JSON file
    const raw = fs.readFileSync("data/logs.json");
    const data = JSON.parse(raw);

    // Add the new login information to the array
    data.logins.push([username, password]);

    // Write the updated JSON back to the file
    fs.writeFileSync("data/logs.json", JSON.stringify(data, null, 2));

    res.render("login-view.ejs",{
        start: false,
        fail: false
    });
});
app.post('/logged', (req,res) => {
    res.render("fst-view.ejs");
});
app.post('/sign-in', (req,res) => {
    res.render("sign-in-view.ejs");
});
app.post('/new-trip', (req,res) => {
    res.render("new-trip-view.ejs");
});
app.post('/validate-trip', (req,res) => {
    res.render("valid-trip.ejs");
});
app.post('/specific-travel', (req,res) => {
    res.render("travel-main-view.ejs");
});

//This was to test the navigation bar, needs to be removed later on, I don't really know in each ejs to link it yet
app.get('/navbar', (req, res) => {
    res.render("navbar.ejs")
})

app.get('/friends', (req, res) => {
    res.render("friends.ejs")
})

//test comment

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});