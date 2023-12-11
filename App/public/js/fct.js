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

//to make a "pay" list and a "get back" list to display in the balance page, depending on the information saved in the debt.json 
function calc_debt(current_user, current, debt, users_list){
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

module.exports = { gather_info_friends_page, get_list_friends, get_name_from_icon, get_icon_from_name, get_roles_per_trip, UpdateRoles, AddOtherUserImages, debtbar, calc_debt };
