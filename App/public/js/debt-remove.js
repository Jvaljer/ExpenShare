/*function remove(exp_name, date, amount, person, trip_name, current_user){
    const raw_debt = fs.readFileSync("data/debt.json");
    const data_debt = JSON.parse(raw_debt);
    const exp_debt = data_debt["debt"];

    for (let i=0; i<exp_debt.length; i++){
        if (exp_debt[i][0] == trip_name){
            for(let j=1; j<exp_debt[i].length; j++){
                if (exp_debt[i][j][0] == person && exp_debt[i][j][2][1] == amount && exp_debt[i][j][2][2] == exp_name && exp_debt[i][j][2][3] == date){
                    exp_debt[i][j][1].remove(current_user);
                }
            }
        }
    }

    fs.writeFileSync("data/debt.json", JSON.stringify(data_debt, null, 2));
}*/

function remove(index) {
    window.location.href = '/debt-everyone?index='+encodeURIComponent(index);
}