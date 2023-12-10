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

function read_users(){
    const raw = fs.readFileSync("data/users.json");
    const data = JSON.parse(raw);
    const users = data["users"];
    return users;
}

function read_trips(){
    const raw = fs.readFileSync("data/trips.json");
    const data = JSON.parse(raw);
    const trip_data = data.trips;
    return trip_data;
}

function read_current(){
    const raw = fs.readFileSync("data/current.json");
    const data = JSON.parse(raw);
    const current = data["current-infos"];
    return current;
}

function read_expenses(){
    const raw = fs.readFileSync("data/expenses.json");
    const data = JSON.parse(raw);
    const expense_list = data["expenses"];
    return expense_list;
}

function read_latest_exp(){
    const raw = fs.readFileSync("data/latest-exp.json");
    const data = JSON.parse(raw);
    const latest_exp = data["latest-exp"];
    return latest_exp;
}

function read_debt(){
    const raw = fs.readFileSync("data/debt.json");
    const data = JSON.parse(raw);
    const debt = data["debt"];
    return debt;
}

function UpdateRoles(trips, roles, current){
    trips.map(function (trip) {
        trip[2].map(function (usr) {
            if (usr[0] === current[0]) {
                roles.map(function (item) {
                    if (item == trip[0]) {
                        usr[1] = roles[roles.indexOf(item) + 1];
                    }
                });
            }
        });
    });
}

function DeleteTrip(trips, del_trip, users){
    const exp_data = JSON.parse(fs.readFileSync("data/expenses.json"));
    const latest_data = JSON.parse(fs.readFileSync("data/latest-exp.json"));
    const debt_data = JSON.parse(fs.readFileSync("data/debt.json"));
    var expenses = exp_data["expenses"];
    var latest = latest_data["latest-exp"];
    var debts = debt_data["debt"];

    trips.map(function(trip){
        if(trip[0] === del_trip){
            trips.splice(trips.indexOf(trip), 1);
            //deleting from user json file
            users.map(function(usr){
                if(usr[1].includes(del_trip)){
                    usr[1].splice(usr[1].indexOf(del_trip), 1);
                }
            })
            //deleting from expenses json files
            expenses.map(function(exp){
                if(exp[0]===del_trip){
                    expenses.splice(expenses.indexOf(exp),1);
                }
            });
            //deleting from latest-exp json file
            latest.map(function(exp){
                if(exp[0]===del_trip){
                    latest.splice(latest.indexOf(exp), 1);
                }
            });
            debts.map(function(debt){
                if(debt[0]===del_trip){
                    debt.splice(debts.indexOf(debt), 1);
                }
            });
        }
    });
    fs.writeFileSync("data/expenses.json", JSON.stringify(exp_data, null, 2));
    fs.writeFileSync("data/latest-exp.json", JSON.stringify(latest_data, null, 2));
    fs.writeFileSync("data/debt.json", JSON.stringify(debt_data, null, 2));
}

function AddOtherUserImages(trip_list, current, user_list){
    let others = [];
    let images = [];
    trip_list.map(function(trip){
        images.push([]);
        trip[2].map(function(user){
            if(user[0]!=current[0]){
                others.push(user);
                images[trip_list.indexOf(trip)].push(get_icon_from_name(user[0], user_list));
            }
        });
        trip[2] = others;
        others = [];
    });
    return images;
}

app.post('/login', (req, res) => {
    //here we would load all datas
    const username = req.body.username;
    const password = req.body.password;

    const data = JSON.parse(fs.readFileSync("data/logs.json"));
    const logs = data["logins"];

    const users_list = read_users();

    let ignore = false;

    logs.map(function(log){
        if(log[0]===username && log[1]===password){
            const users = read_users();
            const trip_data = read_trips();

            let trips = [];
            users.map(function(user){
                if(user[0]===username){
                    user[1].map(function(trip_name){
                        trip_data.map(function(trip){
                            if(trip_name===trip[0]){
                                trips.push(trip);
                            }
                        })
                    });

                    const data_cur = JSON.parse(fs.readFileSync("data/current.json"));
                    data_cur["current-infos"] = [];
                    data_cur["current-infos"].push(username);

                    let imgs = AddOtherUserImages(trips, data_cur["current-infos"], users_list);

                    fs.writeFileSync("data/current.json", JSON.stringify(data_cur, null, 2));

                    res.render("fst-view.ejs", {
                        user: user,
                        trip: trips,
                        images: imgs
                    });
                    ignore = true;
                }
            });
        }
    });
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

    const data = JSON.parse(fs.readFileSync("data/logs.json"));

    data.logins.push([username, password]);
    fs.writeFileSync("data/logs.json", JSON.stringify(data, null, 2));

    //now adding this new user to the user list
    const daata = JSON.parse(fs.readFileSync("data/users.json"));

    daata.users.push([username,[],image]); //can add here an image (use cnt of already existing ones...)
    fs.writeFileSync("data/users.json", JSON.stringify(daata, null, 2));

    res.render("login-view.ejs",{
        start: false,
        fail: false
    });
});

app.all('/logged', (req,res) => {
    const roles_str = req.query.roles;
    let roles;
    let from_profile = false;

    if (roles_str != null) {
        roles = JSON.parse(roles_str);
        from_profile = true;
    }

    const del_trip = req.query.trip;
    let from_delete = false;
    if(del_trip != null){
        from_delete = true;
    }

    const data = JSON.parse(fs.readFileSync("data/current.json"));
    const tmp_file = data["current-infos"];
    if (tmp_file.length > 1) {
        tmp_file.pop();
    }
    const current = tmp_file;
    fs.writeFileSync("data/current.json", JSON.stringify(data, null, 2));

    const user_data = JSON.parse(fs.readFileSync("data/users.json"));
    const users = user_data["users"];

    const trip_data = JSON.parse(fs.readFileSync("data/trips.json"));
    const trips = trip_data["trips"];

    if(from_profile){
        UpdateRoles(trips, roles, current);
    }

    if(from_delete){
        DeleteTrip(trips, del_trip, users);
    }

    fs.writeFileSync("data/trips.json", JSON.stringify(trip_data, null, 2));
    fs.writeFileSync("data/users.json", JSON.stringify(user_data, null, 2));

    var all_trip = [];
    var user_index = -1;

    users.map(function(user){
        if(user[0]===current[0]){
            user_index = users.indexOf(user);
            const user_trips = user[1];
            trips.map(function(trip){
                user_trips.map(function(u_trip){
                    if(u_trip===trip[0]){
                        all_trip.push(trip);
                    }
                });
            });
        }
    });

    let imgs = AddOtherUserImages(all_trip, current, users);

    res.render("fst-view.ejs", {
        user: users[user_index],
        trip: all_trip,
        images: imgs
    });
});

app.post('/sign-in', (req,res) => {
    const data = JSON.parse(fs.readFileSync("data/users.json"));
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
    const users = read_users();
    const cur_user = read_current()[0];

    //here I wanna delete the current user from the users list
    const others = users;
    for(var i=0; i<users.length; i++){
        if(users[i][0]===cur_user){
            others.splice(i,1);
        }
    }

    let categories = ['Groceries','Restaurant', 'Hotel', 'Sleeping', 'Activities', 'Transports','Fuel','Party','Alcohol','Other']

    res.render("new-trip-view.ejs", {
        all_users: others,
        all_categories: categories
    });
});

app.post('/validate-trip', (req, res) => {
    const request = req.body;
    const members = request.members;
    const name = request.name;
    const categories = request.categories;

    const data = JSON.parse(fs.readFileSync("data/trips.json"));
    const cur_usr = read_current()[0];

    var member_list = [
        [cur_usr, "creator"]
    ];
    for(var i=0; i<members.length; i++){
        member_list.push([members[i], "none"]);
    }

    const trip_info = [
        name,
        [request.start, request.end],
        member_list,
        categories,
        request.budget,
        request.comment
    ];

    data.trips.push(trip_info);
    fs.writeFileSync("data/trips.json", JSON.stringify(data, null, 2));

    const data_ = JSON.parse(fs.readFileSync("data/users.json"));
    const users = data_["users"];

    users.map(function(user){
        if(cur_usr===user[0]){
            user[1].push(name);
        }
        members.map(function(member){
            if(member===user[0]){
                user[1].push(name);
            }
        });
    });
    fs.writeFileSync("data/users.json", JSON.stringify(data_, null, 2));

    //to add the trip and its corresponding categories in the expense.json
    const data_exp = JSON.parse(fs.readFileSync("data/expenses.json"));

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

    const data_le = JSON.parse(fs.readFileSync("data/latest-exp.json"));
    const le = data_le["latest-exp"];

    le.push([name]);
    fs.writeFileSync("data/latest-exp.json", JSON.stringify(data_le, null, 2));

    const data_debt = JSON.parse(fs.readFileSync("data/debt.json"));
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

    const data = JSON.parse(fs.readFileSync("data/current.json"));
    const current = data["current-infos"];

    const trips = read_trips();

    if(!from_above){
        name = current[1][0];
    }

    var tname;
    var trip;
    trips.map(function(trp){
        if(name===trp[0]){
            tname = trp[0];
            trip = trp;
        }
    });

    if(from_above){
        current.push(trip);
    }
    fs.writeFileSync("data/current.json", JSON.stringify(data, null, 2));

    let creator = debtbar(current);

    //now I wanna add all the related expenses to the expenses list
    const expense_list = read_expenses();

    var expenses;
    expense_list.map(function(exp){
        if(exp[0]===tname){
            expenses = exp;
        }
    });

    //to take care of the latest expenses
    const latest_exp = read_latest_exp();

    let list_le = []
    latest_exp.map(function(latest){
        if(latest[0] == current[1][0]){
            list_le = latest;
            list_le.shift;
        }
    });

    res.render("travel-main-view.ejs", {
        user: current[0],
        trip_name: tname,
        trip_expenses: expenses,
        role: creator,
        lat_exp: list_le
    });
});

function debtbar(current){
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
    const current = read_current();
    const users_list = read_users();

    let creator = debtbar(current);
    let trip_name = current[1][0];

    let tmp = gather_info_friends_page(current, users_list);

    res.render("friends.ejs", {
        role: creator,
        rolelist: tmp[2],
        namelist: tmp[0],
        picturelist: tmp[1],
        trip_name: trip_name
    })
})

function gather_info_friends_page(current, users_list){
    //creating a list of roles, names, and pictures to display the people from a trip
    let auser = current[0]
    let userslistroles = [];
    let userslistnames = [];
    let userspicture = [];

    current[1][2].map(function(info){
        let name = info[0];
        let role = info[1];
        if(name==auser){
            userslistnames.unshift(name);
            userslistroles.unshift(role);
        } else {
            userslistnames.push(name);
            userslistroles.push(role);
        }
    });

    //for the images, need to organise them in the list in the same order as the name list to have the matching icon with the right name
    userslistnames.forEach(element => {
        if (element == auser){
            userspicture.unshift(get_icon_from_name(auser, users_list));
        } else {
            userspicture.push(get_icon_from_name(element, users_list));
        }
    });
    return [userslistnames, userspicture, userslistroles];
}


function calc_debt(current_user){
    const current = read_current();
    const debt = read_debt();
    const users_list = read_users();

    //to get the current trip
    let current_trip = current[1][0];

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
                        get_back.push([category, amount, date, get_icon_from_name(debt[i][j][1][k], users_list), expense_name])
                    }
                } else if (debt[i][j][1].includes(current_user)){ //to put in pay
                    pay.push([category, amount, date, get_icon_from_name(debt[i][j][0], users_list), expense_name])
                }
            }
        }
    }
    return [pay, get_back];
}

function remove(index, current_trip, current_user){
    const data_debt = JSON.parse(fs.readFileSync("data/debt.json"));
    const exp_debt = data_debt["debt"];

    let compare_index = 0;
    for (let i=0; i<exp_debt.length; i++){
        if (exp_debt[i][0] == current_trip){
            for(let j=1; j<exp_debt[i].length; j++){
                if (exp_debt[i][j][0] != current_user && exp_debt[i][j][1].includes(current_user)){
                    if (compare_index == index){
                        exp_debt[i][j][1].splice(exp_debt[i][j][1].indexOf(current_user),1);
                    }
                    compare_index += 1;
                    //to remove the expense from the list when everybody payed back
                    if (exp_debt[i][j][1].length == 0){
                        exp_debt[i].splice(j,1);
                    }
                }
            }
        }
    }
    fs.writeFileSync("data/debt.json", JSON.stringify(data_debt, null, 2));
}

app.all('/debt-everyone', (req, res) => {
    let index = req.query.index;

    const current = read_current();
    let current_user = current[0];
    let current_trip = current[1][0];

    if (index != undefined){
        remove(index, current_trip, current_user);
    }
    index=undefined;

    let creator = debtbar(current);
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

function get_list_friends(current_user, current_trip, users_list){
    const person_icon = []; 
    for(i=0; i<users_list.length; i++){
        let test = users_list[i][1];
        if (test.includes(current_trip) && users_list[i][0] != current_user){
            person_icon.push(users_list[i][2]);
        }
    }
    return person_icon;
}

function get_name_from_icon(icon, users_list){
    let name = "";
    for(i=0; i<users_list.length; i++){
        if (users_list[i][2] == icon){
            name = users_list[i][0];
        }
    }
    return name;
}

function get_icon_from_name(name, users_list){
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
    let index = req.query.index;

    const users_list = read_users();

    //need to find the user that goes with the image
    let name = get_name_from_icon(personIndex, users_list);

    const current = read_current();
    let current_user = current[0];
    let current_trip = current[1][0];

    //to take care of the "done" button to remove debt when payed
    if (index != undefined && personIndex == undefined){
        remove(index, current_trip, current_user);
    } else if (index != undefined){
        remove(index, current_trip, get_name_from_icon(personIndex, users_list));
    }
    index=undefined;

    //to get the icon for the top right corner
    let icon;
    if (personIndex == undefined){
        icon = get_icon_from_name(current_user, users_list);
    } else{
        icon = personIndex;
    }

    let user;
    if (name == ""){
        user = current_user;
    } else{
        user = name;
    }

    let person_icon = get_list_friends(user, current_trip, users_list);

    let aux = calc_debt(user)
    let pay = aux[0];
    let get_back = aux[1];

    let creator = debtbar(current);
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
    const current = read_current();

    //to get the image corresponding to the current user and the list of trips
    const users_list = read_users();

    let usrimg = "";
    let index = -1;

    for (i=0; i<users_list.length; i++){
        if(users_list[i][0] == current[0]){
            usrimg = users_list[i][2]
            index = i;
        }
    }

    //to get the expenses information for every travel and their categories
    const exp_list = read_expenses();

    //used to get the number of friends in a trip to calculate expenses
    const trip_list = read_trips();

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
            let category = exp_list[i][1][j][0] + ".png"
                        
            //Get the expense per person
            sum = (parseFloat(sum)/number_people).toFixed(2);

            if (sum != 0){
                aux.push([category, sum]) 
            }
        }        
        list_expenses.push(aux);
        
    }

    let spe_roles = get_roles_per_trip(trip_list, users_list, index, current);

    const all_roles = JSON.parse(fs.readFileSync("data/roles.json"))["roles"].map(function(elt){
        return elt;
    });

    res.render("profile.ejs", {
        user: current[0],
        icon: usrimg,
        trips: users_list[index][1],
        expenses: list_expenses,
        roles: all_roles,
        usr_role: spe_roles
    })
})

function get_roles_per_trip(trip_list, users_list, index, current){
    let spe_roles = [];
    users_list[index][1].map(function(e){
        spe_roles.push("");
    })
    trip_list.map(function(trip){
        if(users_list[index][1].includes(trip[0])){
            trip[2].map(function(usr){
                if(usr[0]===current[0]){
                    spe_roles[users_list[index][1].indexOf(trip[0])] = usr[1];
                }
            });
        }
    });
    return spe_roles;
}

app.post('/add-expense', (req, res) => {
    const current = read_current();
    const categories = current[1][3];

    let trip_name = current[1][0];

    let creator = debtbar(current);
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
    
    const data = JSON.parse(fs.readFileSync("data/expenses.json"));
    const exp = data["expenses"];

    //to get the information of who added the travel
    const current = read_current();
    const cur_usr = current[0];
    const cur_travel = current[1][0];

    //to add the expense in the right trip and right category
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
    const data_le = JSON.parse(fs.readFileSync("data/latest-exp.json"));
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
    const data_debt = JSON.parse(fs.readFileSync("data/debt.json"));
    const exp_debt = data_debt["debt"];

    const trip_list = read_trips();

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
  
    let creator = debtbar(current);

    res.render("valid-expense.ejs", {
        role: creator
    })
});

app.get('/valid-expense', (req, res) => {
    res.render("valid-expense.ejs")
});

app.get('/specific-category', (req, res) => {
    const cname = req.query.category; // Use req.query to get the category from the query parameters

    const current = read_current();
    const trip_name = current[1][0];

    let creator = debtbar(current);

    const all_members= current[1][2];
    var members = [];
    for(var i=0; i<all_members.length; i++){
        members.push(all_members[i][0]);
    }

    const users = read_users();

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

    const all_exp = read_expenses();

    var cats;
    for(var i=0; i<all_exp.length; i++){
        if(all_exp[i][0]===trip_name){
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