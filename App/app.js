const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

const fs = require('fs');
const bodyParser = require ('body-parser');
const $ = require('jquery');
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
    //console.log("rendering LOGIN-VIEW with start & !fail _");
    res.render("login-view.ejs", {start:true, fail:false});
});

app.post('/login', (req, res) => {
    //here we would load all datas
    const username = req.body.username;
    const password = req.body.password;
    const raw = fs.readFileSync("data/logs.json");
    const data = JSON.parse(raw);
    const logs = data["logins"];

    console.log("we got them logs : "+logs);

    let ignore = false;
    for(var i=0; i<logs.length; i++){
        if(logs[i][0]===username && logs[i][1]===password){
            //here we wanna load the user from another JSON file
            const raw = fs.readFileSync("data/users.json");
            const data = JSON.parse(raw);
            const users = data["users"];

            const raw_ = fs.readFileSync("data/trips.json");
            const data_ = JSON.parse(raw_);
            const trip_data = data_.trips;
            let trips = [];
            for(var i=0; i<users.length; i++){
                if(users[i][0]===username){
                    for(var j=0; j<users[i][1].length; j++){
                        var trip_name = users[i][1][j];
                        console.log("searching "+trip_name);
                        for(var k=0; k<trip_data.length; k++){
                            if(trip_name===trip_data[k][0]){
                                console.log("found it : "+trip_data[k]);
                                trips.push(trip_data[k]);
                            }
                        }
                    }

                    const raw_cur = fs.readFileSync("data/current.json");
                    const data_cur = JSON.parse(raw_cur);
                    data_cur["current-infos"] = []; //emptying all previous infos
                    data_cur["current-infos"].push(username);
                    data_cur["current-infos"].push(trips);
                    fs.writeFileSync("data/current.json", JSON.stringify(data_cur, null, 2));

                    //console.log("rendering FST-VIEW with user & trips /LOGIN");
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
        //console.log("rendering LOGIN-VIEW with !start & fail /LOGIN");
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

    //now adding this new user to the user list (ofc)
    const raaw = fs.readFileSync("data/users.json");
    const daata = JSON.parse(raaw);
    daata.users.push([username,[],"user1.png"]); //can add here an image (use cnt of already existing ones...)
    fs.writeFileSync("data/users.json", JSON.stringify(daata, null, 2));

    console.log("rendering LOGIN-VIEW with !start & !fail + new logs /LOG");
    res.render("login-view.ejs",{
        start: false,
        fail: false
    });
});
app.post('/logged', (req,res) => {
    //here we first wanna get the actual user & trips
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];

    //console.log("rendering FST-VIEW with _ /LOGGED");
    res.render("fst-view.ejs", {
        user: current[0],
        trip: current[1]
    });
});
app.post('/sign-in', (req,res) => {
    //console.log("rendering SIGN-IN-VIEW with _ /SIGN-IN");
    res.render("sign-in-view.ejs");
});
app.post('/new-trip', (req,res) => {
    //console.log("rendering NEW-TRIP-VIEW with _ /NEW-TRIP");
    res.render("new-trip-view.ejs");
});

//dunno why but have this strange duplicata .post & .get which seems to be the only working way...
//shall ask julopipo
app.post('/validate-trip', (req, res) => {
    console.log("POST /validate-trip");

    const name = req.body.name;
    const start = req.body.start;
    const end = req.body.end;
    const budget = req.body.budget;
    const img = req.body.img;
    const comment = req.body.comment;
    const members = req.body.members;
    const categories = req.body.categories;

    //adding new travel here
    const raw = fs.readFileSync("data/trips.json");
    const data = JSON.parse(raw);

    const cur_usr = JSON.parse(fs.readFileSync("data/current.json"))["current-infos"][0];

    var member_list = [
        [cur_usr, "creator"]
    ];
    for(var i=0; i<members.length; i++){
        member_list.push([members[i], "none"]);
    }

    var category_list = [];
    for(var i=0; i<categories.length; i++){
        var category = categories[i];
        category_list.push([category]);
    }

    const trip_info = [
            name,
            [start, end],
            member_list,
            category_list,
            budget,
            img,
            comment
    ];

    data.trips.push(trip_info);

    fs.writeFileSync("data/trips.json", JSON.stringify(data, null, 2));

    //now need to add this new trip to the current ones
    const raw_cur = fs.readFileSync("data/current.json");
    const data_cur = JSON.parse(raw_cur);
    data_cur["current-infos"][1].push(trip_info);
    fs.writeFileSync("data/current.json", JSON.stringify(data_cur, null, 2));

    res.render("valid-trip.ejs");
});
app.get('/validate-trip', (req,res) => {
    //console.log("rendering VALID-TRIP with _ /VALIDATE-TRIP");
    console.log("GET /validate-trip");
    res.render("valid-trip.ejs");
});

app.post('/specific-travel', (req,res) => {
    //console.log("rendering TRAVEL-MAIN-VIEW with _ /SPECIFIC-TRAVEL");
    res.render("travel-main-view.ejs");
});

//This was to test the navigation bar, needs to be removed later on, I don't really know in each ejs to link it yet
app.get('/navbar', (req, res) => {
    //console.log("rendering NAVBAR with _ /NAVBAR");
    res.render("navbar.ejs")
})

app.get('/friends', (req, res) => {
    //console.log("rendering FRIENDS with _ /FRIENDS");
    res.render("friends.ejs")
})

app.get('/debt-everyone', (req, res) => {
    //console.log("rendering DEBT-EVERYONE with _ /DEBT-EVERYONE");
    res.render("debt-everyone.ejs")
})

app.get('/debt-admin', (req, res) => {
    //console.log("rendering DEBT-ADMIN with _ /DEBT-ADMIN");
    res.render("debt-admin.ejs")
})

app.get('/profile', (req, res) => {
    //console.log("rendering PROFILE with _ /PROFILE");
    res.render("profile.ejs")
})

app.get('/add-expense', (req, res) => {
    //console.log("rendering ADD-EXPENSE with _ /ADD-EXPENSE");
    res.render("add-expense.ejs")
})

app.post('/valid-expense', (req, res) => {
    //console.log("rendering VALID-EXPENSE with _ /VALID-EXPENSE");
    res.render("valid-expense.ejs")
})


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});