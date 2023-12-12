var canva = document.getElementById('category-chart');

const data_div = document.querySelector('.container');
const all_exps = JSON.parse(data_div.dataset.expenses);

const all_colors = ["#FFA502", "#7BED9F", "#FF6B81", "#ECCC68", "#FF6348", "#70A1FF", "#1E90FF", "#57606F"];

//initializing all chart variables
var members = [];
var values = [];
var colors = [];
for(var i=0; i<all_exps.length; i++){
    members.push(all_exps[i][0]);
    values.push(all_exps[i][1]);
    colors.push(all_colors[i]);
}

const data = {
    labels: members,
    datasets: [{
        label: 'Members Expenses Amount',
        data: values,
        backgroundColor: colors,
        hoverOffset: 4
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
    },
};

const category_chart = new Chart(canva, config);