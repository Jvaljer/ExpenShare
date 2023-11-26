const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

const fs = require('fs');
const bodyParser = require ( 'body-parser');
const chart = require('chart.js');
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
    console.log("rendering LOGIN-VIEW with start & !fail _");
    res.render("login-view.ejs", {start:true, fail:false});
});

app.post('/login', (req, res) => {
    //here we would load all datas
    const username = req.body.username;
    const password = req.body.password;
    const raw = fs.readFileSync("data/logs.json");
    const data = JSON.parse(raw);
    const logs = data["logins"];

    let ignore = false;

    for(var i=0; i<logs.length; i++){
        if(logs[i][0]===username && logs[i][1]===password){
            //here we wanna load the user from another JSON file
            const raw = fs.readFileSync("data/users.json");
            const data = JSON.parse(raw);
            const users = data["users"];

            const raw_ = fs.readFileSync("data/trips.json");
            const data_ = JSON.parse(raw_);
            let trips = [];
            for(var i=0; i<users.length; i++){
                if(users[i][0]===username){
                    for(var j=0; j<users[i][1].length; j++){
                        trips.push(data_[users[i][1][j]]);
                    }
                    console.log("rendering FST-VIEW with user & trips /LOGIN");
                    res.render("fst-view.ejs", {
                        user: users[i],
                        trip: trips
                    });
                    ignore = true;
                }
            }
        }
    }
    if(!ignore){
        console.log("rendering LOGIN-VIEW with !start & fail /LOGIN");
        res.render("login-view.ejs",{
            start: false,
            fail: true
        });
    }
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

    console.log("rendering LOGIN-VIEW with !start & !fail /LOG");
    res.render("login-view.ejs",{
        start: false,
        fail: false
    });
});
app.post('/logged', (req,res) => {
    console.log("rendering FST-VIEW with _ /LOGGED");
    res.render("fst-view.ejs");
});
app.post('/sign-in', (req,res) => {
    console.log("rendering SIGN-IN-VIEW with _ /SIGN-IN");
    res.render("sign-in-view.ejs");
});
app.get('/new-trip', (req,res) => {
    console.log("rendering NEW-TRIP-VIEW with _ /NEW-TRIP");
    res.render("new-trip-view.ejs");
});
app.post('/validate-trip', (req,res) => {
    console.log("rendering VALID-TRIP with _ /VALIDATE-TRIP");
    res.render("valid-trip.ejs");
});
app.post('/specific-travel', (req,res) => {
    console.log("rendering TRAVEL-MAIN-VIEW with _ /SPECIFIC-TRAVEL");
    res.render("travel-main-view.ejs");
});

//This was to test the navigation bar, needs to be removed later on, I don't really know in each ejs to link it yet
app.get('/navbar', (req, res) => {
    console.log("rendering NAVBAR with _ /NAVBAR");
    res.render("navbar.ejs")
})

app.get('/friends', (req, res) => {
    console.log("rendering FRIENDS with _ /FRIENDS");
    res.render("friends.ejs")
})

app.get('/debt-everyone', (req, res) => {
    console.log("rendering DEBT-EVERYONE with _ /DEBT-EVERYONE");
    res.render("debt-everyone.ejs")
})

app.get('/debt-admin', (req, res) => {
    console.log("rendering DEBT-ADMIN with _ /DEBT-ADMIN");
    res.render("debt-admin.ejs")
})

app.get('/profile', (req, res) => {
    console.log("rendering PROFILE with _ /PROFILE");
    res.render("profile.ejs")
})

app.get('/add-expense', (req, res) => {
    console.log("rendering ADD-EXPENSE with _ /ADD-EXPENSE");
    res.render("add-expense.ejs")
})

app.post('/valid-expense', (req, res) => {
    console.log("rendering VALID-EXPENSE with _ /VALID-EXPENSE");
    res.render("valid-expense.ejs")
})


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});