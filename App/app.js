const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

const fs = require('fs');
const bodyParser = require ('body-parser');
const $ = require('jquery');

app.use(express.static(__dirname));
// Adding css and js files from installed apps
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
//using bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
//using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
                        for(var k=0; k<trip_data.length; k++){
                            if(trip_name===trip_data[k][0]){
                                trips.push(trip_data[k]);
                            }
                        }
                    }

                    const raw_cur = fs.readFileSync("data/current.json");
                    const data_cur = JSON.parse(raw_cur);
                    data_cur["current-infos"] = []; //emptying all previous infos

                    data_cur["current-infos"].push(username);

                    let others = [];
                    let imgs = [];
                    for(var j=0; j<trips.length; j++){
                        imgs.push([]);
                        for(var k=0; k<trips[j][2].length; k++){
                            if(trips[j][2][k][0]!=username){
                                others.push(trips[j][2][k]);
                                for(var n=0; n<users.length; n++){
                                    if(users[n][0]===trips[j][2][k][0]){
                                        imgs[j].push(users[n][2]);
                                    }
                                }
                            }
                        }
                        trips[j][2] = others;
                        others = [];
                    }
                    fs.writeFileSync("data/current.json", JSON.stringify(data_cur, null, 2));

                    res.render("fst-view.ejs", {
                        user: users[i],
                        trip: trips,
                        images: imgs
                    });

                    ignore = true;
                }
            }
        }
    }
    if(!ignore){
        res.render("login-view.ejs",{
            start: false,
            fail: true
        });
    }
});
app.get('/log', (req,res)=>{
    const username = req.query.username;
    const password = req.query.password;
    const image = req.query.image;

    const raw = fs.readFileSync("data/logs.json");
    const data = JSON.parse(raw);

    data.logins.push([username, password]);
    fs.writeFileSync("data/logs.json", JSON.stringify(data, null, 2));

    //now adding this new user to the user list (ofc)
    const raaw = fs.readFileSync("data/users.json");
    const daata = JSON.parse(raaw);

    daata.users.push([username,[],image]); //can add here an image (use cnt of already existing ones...)
    fs.writeFileSync("data/users.json", JSON.stringify(daata, null, 2));

    res.render("login-view.ejs",{
        start: false,
        fail: false
    });
});
app.all('/logged', (req,res) => {
    const roles_str = req.query.roles;
    const roles = JSON.parse(roles_str);

    //here we first wanna get the actual user & trips
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const tmp_file = data["current-infos"];

    //here we wanna remove the latest trip if it exists
    if(tmp_file.length>1){
        tmp_file.pop();
    }

    const current = tmp_file;
    fs.writeFileSync("data/current.json", JSON.stringify(data, null, 2));

    const raw_ = fs.readFileSync("data/users.json");
    const data_ = JSON.parse(raw_);
    const users = data_["users"];

    const raaw = fs.readFileSync("data/trips.json");
    const daata = JSON.parse(raaw);
    const trips = daata["trips"];

    trips.map(function(trip){
        trip[2].map(function(usr){
            if(usr[0]===current[0]){
                roles.map(function(item){
                    if(item==trip[0]){
                        usr[1]=roles[roles.indexOf(item)+1];
                    }
                });
            }
        });
    });
    fs.writeFileSync("data/trips.json", JSON.stringify(daata, null, 2));

    var all_trip = [];
    var user_index = -1;
    for(var i=0; i<users.length; i++){
        if(users[i][0]===current[0]){
            user_index = i;
            const user_trips = users[i][1];
            for(var j=0; j<trips.length; j++){
                for(var k=0; k<user_trips.length; k++){
                    if(user_trips[k]===trips[j][0]){
                        all_trip.push(trips[j]);
                    }
                }
            }
        }
    }

    let others = [];
    let imgs = [];
    for(var j=0; j<all_trip.length; j++){
        imgs.push([]);
        for(var k=0; k<all_trip[j][2].length; k++){
            if(all_trip[j][2][k][0]!=current[0]){
                others.push(all_trip[j][2][k]);
                for(var n=0; n<users.length; n++){
                    if(users[n][0]===trips[j][2][k][0]){
                        imgs[j].push(users[n][2]);
                    }
                }
            }
        }
        all_trip[j][2] = others;
        others = [];
    }

    res.render("fst-view.ejs", {
        user: users[user_index],
        trip: all_trip,
        images: imgs
    });
});
app.post('/sign-in', (req,res) => {
    const raw = fs.readFileSync("data/users.json");
    const data = JSON.parse(raw);
    const images = data["users"].map(function(usr){
       return usr[2];
    });
    let icons = [];
    for(var i=0; i<=16; i++){
        let file = "usr"+i+".png";
        if(!images.includes(file)){
            icons.push(file);
        }
    }
    res.render("sign-in-view.ejs", {
        icons: icons
    });
});
app.post('/new-trip', (req,res) => {
    const raw = fs.readFileSync("data/users.json");
    const data = JSON.parse(raw);
    const users= data["users"];

    //here I wanna delete the current user from the sent list
    const raw_ = fs.readFileSync("data/current.json");
    const data_ = JSON.parse(raw_);
    const cur_user = data_["current-infos"][0];

    const others = users;
    for(var i=0; i<users.length; i++){
        if(users[i][0]===cur_user){
            others.splice(i,1);
        }
    }

    const raaw = fs.readFileSync("data/categories.json");
    const daata = JSON.parse(raaw);
    const categories = daata["categories"];

    res.render("new-trip-view.ejs", {
        all_users: others,
        all_categories: categories
    });
});

app.post('/validate-trip', (req, res) => {

    const name = req.body.name;
    const start = req.body.start;
    const end = req.body.end;
    const budget = req.body.budget;
    const comment = req.body.comment;
    const members = req.body.members;
    const categories = req.body.categories;
    const color = req.body.color;

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

    const trip_info = [
        name,
        [start, end],
        member_list,
        categories,
        budget,
        comment,
        color
    ];

    data.trips.push(trip_info);
    fs.writeFileSync("data/trips.json", JSON.stringify(data, null, 2));

    const raw_ = fs.readFileSync("data/users.json");
    const data_ = JSON.parse(raw_);
    const users = data_["users"];
    for(var i=0; i<users.length; i++){
        if(cur_usr===users[i][0]){
            users[i][1].push(name);
        }
        for(var j=0; j<members.length; j++){
            if(members[j]===users[i][0]){
                users[i][1].push(name);
            }
        }
    }
    //here we'd like to add the trip in other user's list
    fs.writeFileSync("data/users.json", JSON.stringify(data_, null, 2));

    //to add the trip and its corresponding categories in the expense.json
    const raw_exp = fs.readFileSync("data/expenses.json");
    const data_exp = JSON.parse(raw_exp);

    let categories_exp = []
    for(i=0; i<categories.length; i++){
        categories_exp.push([categories[i], []]);
    }

    const info_expense = [
        name, 
        categories_exp
    ];

    data_exp.expenses.push(info_expense);
    fs.writeFileSync("data/expenses.json", JSON.stringify(data_exp, null, 2));

    const raw_le = fs.readFileSync("data/latest-exp.json");
    const data_le = JSON.parse(raw_le);
    const le = data_le["latest-exp"];

    le.push([name]);
    fs.writeFileSync("data/latest-exp.json", JSON.stringify(data_le, null, 2));

    const raw_debt = fs.readFileSync("data/debt.json");
    const data_debt = JSON.parse(raw_debt);
    const exp_debt = data_debt["debt"];

    exp_debt.push([name]);
    fs.writeFileSync("data/debt.json", JSON.stringify(data_debt, null, 2));

    res.render("valid-trip.ejs");
});

app.get('/validate-trip', (req,res) => {
    res.render("valid-trip.ejs");
});


app.post('/specific-travel', (req,res) => {
    let name = req.body.travelname;
    let from_above = (name!=null);

    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];

    const raw_ = fs.readFileSync("data/trips.json");
    const data_ = JSON.parse(raw_);
    const trips = data_["trips"];

    if(!from_above){
        name = current[1][0];
    }

    var tname;
    var trip;
    for(var i=0; i<trips.length; i++){
        if(name===trips[i][0]){
            tname = trips[i][0];
            trip = trips[i];
        }
    }

    if(from_above){
        current.push(trip);
    }
    fs.writeFileSync("data/current.json", JSON.stringify(data, null, 2));

    let creator = debtbar();

    //now I wanna add all the related expenses to the expenses list
    const raaw = fs.readFileSync("data/expenses.json");
    const daata = JSON.parse(raaw);
    const expense_list = daata["expenses"];

    var expenses;
    for(var i=0; i<expense_list.length; i++){
        if(expense_list[i][0]===tname){
            expenses = expense_list[i];
        }
    }

    //to take care of the latest expenses
    const raw_le = fs.readFileSync("data/latest-exp.json");
    const data_le = JSON.parse(raw_le);
    const latest_exp = data_le["latest-exp"];

    let list_le = []
    for(let i=0; i<latest_exp.length; i++){
        if (latest_exp[i][0] == current[1][0]){
            list_le = latest_exp[i];
            list_le.shift() //erase the first element of the list (the trip name)
        }
    }
    console.log("list_le="+list_le);

    res.render("travel-main-view.ejs", {
        user: current[0],
        trip_name: tname,
        trip_expenses: expenses,
        role: creator,
        lat_exp: list_le
    });
});

function debtbar(){
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];

    let auser = current[0]
    let userslist = [];
    let creator = false;

    for (var i=0; i<current.length; i++){
        userslist.push(current[1][2][i])
    }

    if (userslist.length >0){
        for (var i=0; i<userslist.length; i++){
            if (userslist[i][0] == auser){ 
                if (userslist[i][1] == "creator"){
                    creator = true;
                } else {
                    creator = false;
                }
            }
        }
    }
    return creator;
};



app.post('/friends', (req, res) => {
    let creator = debtbar();
    
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];

    //creating a list of roles, names, and pictures to display the people from a trip
    let auser = current[0]
    let userslistroles = [];
    let userslistnames = [];
    let userspicture = [];

    for (var i=0; i<current[1][2].length; i++){
        if (current[1][2][i][0] == auser){  //to have the current user appear as the first one in the list
            userslistnames.unshift(current[1][2][i][0]);
            userslistroles.unshift(current[1][2][i][1]);
        } else {
            userslistroles.push(current[1][2][i][1]);
            userslistnames.push(current[1][2][i][0]);
        }
    }

    //for the images, need to go into the users json file and organise them in the list in the same order as the name list to have the matching icon with the right name
    const raw_users = fs.readFileSync("data/users.json");
    const data_users = JSON.parse(raw_users);
    const current_users = data_users["users"];

    for (i=0; i<userslistnames.length; i++){
        for (var j=0; j<current_users.length; j++){
            if(userslistnames[i] == current_users[j][0]){
                if (userslistnames[i] == auser){
                    userspicture.unshift(current_users[j][2])
                } else {
                    userspicture.push(current_users[j][2]);
                }
            }
        }
    }

    let trip_name = current[1][0];

    res.render("friends.ejs", {
        role: creator,
        rolelist: userslistroles,
        namelist: userslistnames,
        picturelist: userspicture,
        trip_name: trip_name
    })
})

/*function calc_debt(current_user){
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];

    //to get the current trip and user
    let current_trip = current[1][0];
   
    //to get the number of people in the trip
    let people_trip = current[1][2].length;

    const raw_exp = fs.readFileSync("data/expenses.json");
    const data_exp = JSON.parse(raw_exp);
    const exp = data_exp["expenses"];

    const raw_cat = fs.readFileSync("data/categories.json");
    const data_cat = JSON.parse(raw_cat);
    const cat = data_cat["categories"];

    //to get the icon of the person to pay 
    const raw_user = fs.readFileSync("data/users.json");
    const data_user = JSON.parse(raw_user);
    const users_list = data_user["users"];

    //to get the list of friends of the trip
    const raw_trip = fs.readFileSync("data/trips.json");
    const data_trip = JSON.parse(raw_trip);
    const trip_list = data_trip["trips"];
    
    let list_friends = [];
    for (let i=0; i<trip_list.length; i++){
        if (current_trip == trip_list[i][0]){
            for(let j=0; j<trip_list[i][2].length; j++){
                if (trip_list[i][2][j][0] != current_user){
                    list_friends.push(trip_list[i][2][j][0]);
                }
            }
        }
    } 

    // 1) Find the corresponding trip in expenses.json
    let get_back = [];
    let pay = [];
    for (let i=0; i<exp.length; i++){
        if (exp[i][0] == current_trip){
            // 2) Go through the expenses
            for (let j=0; j<exp[i][1].length; j++){
                let category_name = exp[i][1][j][0];
                let category = "";
                //to get the icon corresponding to the category name
                for (let p=0; p<cat.length; p++){
                    if (category_name == cat[p][0]){
                        category = cat[p][1];
                    }
                }
                for (let k=0; k<exp[i][1][j][1].length; k++){
                    let amount = (parseFloat(exp[i][1][j][1][k][2])/people_trip).toFixed(2);
                    let date = exp[i][1][j][1][k][3];
                    let person = exp[i][1][j][1][k][0];
                    let expense_name = exp[i][1][j][1][k][1];
                    // 3) if the user is the one that created the expense, will go into the get back list, otherwise will go into the pay list
                    if (person == current_user){
                        for (let n=0; n<list_friends.length; n++){
                            get_back.push([category, amount, date, get_icon_from_name(list_friends[n]), expense_name]);
                        }                     
                    } else{
                        pay.push([category, amount, date, get_icon_from_name(person), expense_name])
                    }  
                }
            }
        }
    }
    return [pay, get_back];
}*/

function calc_debt(current_user){
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];

    //to get the current trip and user
    let current_trip = current[1][0];

    const raw_debt = fs.readFileSync("data/debt.json");
    const data_debt = JSON.parse(raw_debt);
    const debt = data_debt["debt"];

    // 1) Find the corresponding trip in debt.json
    let get_back = [];
    let pay = [];
    for (let i=0; i<debt.length; i++){
        if (debt[i][0] == current_trip){
            for (let j=1; j<debt[i].length; j++){
                let amount = debt[i][j][2][1];
                let category = debt[i][j][2][0] + ".png";
                let date = debt[i][j][2][3];
                let expense_name = debt[i][j][2][2];
                if (debt[i][j][0] == current_user){ //to put in get_back
                    for(let k=0; k<debt[i][j][1].length; k++){
                        get_back.push([category, amount, date, get_icon_from_name(debt[i][j][1][k]), expense_name])
                    }
                } else if (debt[i][j][1].includes(current_user)){ //to put in pay
                    pay.push([category, amount, date, get_icon_from_name(debt[i][j][0]), expense_name])
                }
            }
        }
    }
    return [pay, get_back];
}

function remove(index, current_trip, current_user){
    console.log("je passe par la")
    const raw_debt = fs.readFileSync("data/debt.json");
    const data_debt = JSON.parse(raw_debt);
    const exp_debt = data_debt["debt"];

    let compare_index = 0;
    for (let i=0; i<exp_debt.length; i++){
        if (exp_debt[i][0] == current_trip){
            for(let j=1; j<exp_debt[i].length; j++){
                if (exp_debt[i][j][0] != current_user && exp_debt[i][j][1].includes(current_user)){
                    if (compare_index == index){
                        exp_debt[i][j][1].splice(exp_debt[i][j][1].indexOf(current_user),1);
                        //exp_debt[i].splice(j,1);
                    }
                    compare_index += 1;
                }
            }
        }
    }
    fs.writeFileSync("data/debt.json", JSON.stringify(data_debt, null, 2));
}

app.get('/debt-everyone', (req, res) => {
    let index = req.query.index;

    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];
    let current_user = current[0];
    let current_trip = current[1][0];

    if (index != undefined){
        remove(index, current_trip, current_user);
    }

    index=undefined;

    let creator = debtbar();
    let aux = calc_debt(current_user)
    let pay = aux[0];
    let get_back = aux[1];

    let trip_name = current[1][0];

    res.render("debt-everyone.ejs", {
        role: creator,
        get_back: get_back,
        pay: pay,
        trip_name: trip_name,
        current_user: current_user
    })
})

app.post('/debt-everyone', (req, res) => {
    let index = req.query.index;

    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];
    let current_user = current[0];
    let current_trip = current[1][0];

    if (index != undefined){
        remove(index, current_trip, current_user);
    }

    let creator = debtbar();
    let aux = calc_debt(current_user)
    let pay = aux[0];
    let get_back = aux[1];

    let trip_name = current[1][0];

    res.render("debt-everyone.ejs", {
        role: creator,
        get_back: get_back,
        pay: pay,
        trip_name: trip_name,
        current_user: current_user
    })
})

function get_list_friends(current_user, current_trip){
    const raw_user = fs.readFileSync("data/users.json");
    const data_user = JSON.parse(raw_user);
    const users_list = data_user["users"];

    const person_icon = []; 
    for(i=0; i<users_list.length; i++){
        let test = users_list[i][1];
        if (test.includes(current_trip) && users_list[i][0] != current_user){
            person_icon.push(users_list[i][2]);
        }
    }
    return person_icon;
}

function get_name_from_icon(icon){
    const raw_user = fs.readFileSync("data/users.json");
    const data_user = JSON.parse(raw_user);
    const users_list = data_user["users"];

    let name = "";
    for(i=0; i<users_list.length; i++){
        if (users_list[i][2] == icon){
            name = users_list[i][0];
        }
    }
    return name;
}

function get_icon_from_name(name){
    const raw_user = fs.readFileSync("data/users.json");
    const data_user = JSON.parse(raw_user);
    const users_list = data_user["users"];

    let icon = "";
    for(i=0; i<users_list.length; i++){
        if (users_list[i][0] == name){
            icon = users_list[i][2];
        }
    }
    return icon;
}

app.get('/debt-admin', (req, res) => {
    let personIndex = req.query.personIndex;

    //need to find the user that goes with the image
    let name = get_name_from_icon(personIndex);

    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];
    let current_user = current[0];
    let current_trip = current[1][0];

    //to get the icon for the top right corner
    let icon;
    if (personIndex == undefined){
        icon = get_icon_from_name(current_user);
    } else{
        icon = personIndex;
    }

    let user;
    if (name == ""){
        user = current_user;
    } else{
        user = name;
    }

    let person_icon = get_list_friends(user, current_trip);

    let aux = calc_debt(user)
    let pay = aux[0];
    let get_back = aux[1];

    let creator = debtbar();
    res.render("debt-admin.ejs", {
        role: creator,
        pay: pay,
        get_back: get_back,
        people: person_icon,
        trip_name: current_trip,
        icon: icon
    });
});

app.post('/profile', (req, res) => {
    //to get the name of the current user
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];

    //to get the image corresponding to the current user and the list of trips
    const raw_users = fs.readFileSync("data/users.json");
    const data_users = JSON.parse(raw_users);
    const users_list = data_users["users"];

    let usrimg = "";
    let index = -1;

    for (i=0; i<users_list.length; i++){
        if(users_list[i][0] == current[0]){
            usrimg = users_list[i][2]
            index = i;
        }
    }

    //to get the expenses information for every travel and their categories
    const raw_exp = fs.readFileSync("data/expenses.json");
    const data_exp = JSON.parse(raw_exp);
    const exp_list = data_exp["expenses"];

    //used to get the number of friends in a trip to calculate expenses
    const raw_trip = fs.readFileSync("data/trips.json");
    const data_trip = JSON.parse(raw_trip);
    const trip_list = data_trip["trips"];

    let list_expenses = [];
    for(i=0; i<exp_list.length; i++){
        let aux = [exp_list[i][0]];

        //get the number of participants in the trip
        let number_people;
        for (j=0; j<trip_list.length; j++){
            if( trip_list[j][0] == exp_list[i][0]){
                number_people = (trip_list[j][2].length);
            }
        }  

        for (j=0; j<exp_list[i][1].length; j++){
            let sum = 0;
            for (k=0; k<exp_list[i][1][j][1].length; k++){
                sum += parseInt(exp_list[i][1][j][1][k][2]) //to get the expense amount
            }
            //get the icon instead of the name of the category
            const raw_cat = fs.readFileSync("data/categories.json");
            const data_cat = JSON.parse(raw_cat);
            const cat_list = data_cat["categories"];
            let idx = -1;
            for(k=0; k<cat_list.length; k++){
                if(cat_list[k][0] == exp_list[i][1][j][0]){
                    idx = k;
                }
            }
            //Get the number of user to divide the sum to have the epxense per person
            
            sum = (parseFloat(sum)/number_people).toFixed(2);

            aux.push([cat_list[idx][1], sum]) //name of the category
        }
        
        list_expenses.push(aux);
        
    }

    const all_roles = JSON.parse(fs.readFileSync("data/roles.json"))["roles"].map(function(elt){
        return elt;
    });

    res.render("profile.ejs", {
        user: current[0],
        icon: usrimg,
        trips: users_list[index][1],
        expenses: list_expenses,
        roles: all_roles
    })
})

app.post('/add-expense', (req, res) => {
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];
    const categories = current[1][3];

    let trip_name = current[1][0];

    let creator = debtbar();
    res.render("add-expense.ejs", {
        role: creator,
        categories: categories,
        trip_name: trip_name
    })
})


app.post('/valid-expense', (req, res) => {
    const name = req.body.name;
    const amount = req.body.amount;
    const date = req.body.date;
    const category = req.body.category;
    const comment = req.body.comment;
    
    const raw = fs.readFileSync("data/expenses.json");
    const data = JSON.parse(raw);
    const exp = data["expenses"];

    //to get the information of who added the travel
    const cur_usr = JSON.parse(fs.readFileSync("data/current.json"))["current-infos"][0];
    const cur_travel = JSON.parse(fs.readFileSync("data/current.json"))["current-infos"][1][0];

    for(var i=0; i<exp.length; i++){
        if(cur_travel == exp[i][0]){
            for(j=0; j<exp[i][1].length; j++){
                if(category == exp[i][1][j][0]){
                    exp[i][1][j][1].push([cur_usr, name, amount, date, comment])
                }
            }
        }
    }

    fs.writeFileSync("data/expenses.json", JSON.stringify(data, null, 2));

    //to update the latest expenses
    const raw_le = fs.readFileSync("data/latest-exp.json");
    const data_le = JSON.parse(raw_le);
    const exp_le = data_le["latest-exp"];

    for (i=0; i<exp_le.length; i++){
        if (exp_le[i][0] == cur_travel && exp_le.length == 4){
            exp_le[i].splice(1,1);
            exp_le[i].push([category, amount, name, date]);
        } else if(exp_le[i][0] == cur_travel){
            exp_le[i].push([category, amount, name, date]);
        }
    }

    fs.writeFileSync("data/latest-exp.json", JSON.stringify(data_le, null, 2));

    //to update the list of debts
    const raw_debt = fs.readFileSync("data/debt.json");
    const data_debt = JSON.parse(raw_debt);
    const exp_debt = data_debt["debt"];

    const raw_trip = fs.readFileSync("data/trips.json");
    const data_trip = JSON.parse(raw_trip);
    const trip_list = data_trip["trips"];

    //get the list of people that are part of the trip (expect current user)
    let list_friends = [];
    for (let i=0; i<trip_list.length; i++){
        if (cur_travel == trip_list[i][0]){
            for(let j=0; j<trip_list[i][2].length; j++){
                if (trip_list[i][2][j][0] != cur_usr){
                    list_friends.push(trip_list[i][2][j][0]);
                }
            }
        }
    } 

    for (let i=0; i<exp_debt.length; i++){
        let amount_per_person = (parseFloat(amount)/(list_friends.length+1)).toFixed(2);
        if (exp_debt[i][0] == cur_travel){
            exp_debt[i].push([cur_usr, list_friends, [category, amount_per_person, name, date]])
        }
    }

    fs.writeFileSync("data/debt.json", JSON.stringify(data_debt, null, 2));
    
    

   
    let creator = debtbar();

    res.render("valid-expense.ejs", {
        role: creator
    })
});

app.get('/valid-expense', (req, res) => {
    res.render("valid-expense.ejs")
});
app.get('/specific-category', (req, res) => {
    let creator = debtbar();
    const cname = req.query.category; // Use req.query to get the category from the query parameters

    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const trip = data["current-infos"][1][0];

    const all_members= data["current-infos"][1][2];
    var members = [];
    for(var i=0; i<all_members.length; i++){
        members.push(all_members[i][0]);
    }

    const raw_ = fs.readFileSync("data/users.json");
    const data_ = JSON.parse(raw_);
    const users = data_["users"];

    var images = [];
    for(var i=0; i<members.length; i++){
        images.push("");
    }
    for(var i=0; i<users.length; i++){
        for(var j=0; j<members.length; j++){
            if(users[i][0]===members[j]){
                images[j] = users[i][2];
            }
        }
    }

    const raaw = fs.readFileSync("data/expenses.json");
    const daata = JSON.parse(raaw);
    const all_exp = daata["expenses"];

    var cats;
    for(var i=0; i<all_exp.length; i++){
        if(all_exp[i][0]===trip){
            cats = all_exp[i][1];
        }
    }

    var spe_exp;
    for(var i=0; i<cats.length; i++){
        if(cats[i][0]===cname){
            spe_exp = cats[i];
        }
    }
    var exps = []; //this must contain list like this [username, whole amount]
    for(var i=0; i<members.length; i++){
        exps.push([members[i], 0, images[i]]);
    }
    const cat_exp = spe_exp[1];
    for(var i=0; i<cat_exp.length; i++){
        for(var j=0; j<exps.length; j++){
            if(cat_exp[i][0]===exps[j][0]){
                exps[j][1] += parseInt(cat_exp[i][2]);
            }
        }
    }

    let trip_name = data["current-infos"][1][0];

    res.render("specific-category.ejs", {
        role: creator,
        category: cname,
        expenses: exps,
        trip_name: trip_name
    });
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});