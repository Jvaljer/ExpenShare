var my_canva = document.getElementById('myChart');

const data_div = document.querySelector('.trip-name');
const trip_data = JSON.parse(data_div.dataset.trip);

const trip_categories = trip_data[3];
const all_colors = ["#FF6348", "#ECCC68", "#1E90FF", "#7BED9F", "#57606F"];

//initializing all chart values
var categories = [];
var values = [];
var colors = []

for(var i=0; i<trip_categories.length; i++){
    categories.push(trip_categories[i][0]);
    var value = 0;
    for(var k=1; k<trip_categories[i].length; k++){
        value += trip_categories[i][k][1];
    }
    values.push(value);
    colors.push(all_colors[i]);
}

//here we wanna set the datas used by the chart
const data = {
    labels: categories,
    datasets: [{
        label: 'Trip Dataset',
        data: values,
        backgroundColor: colors,
        hoverOffset: 4
    }]
};

/*const data = {
    labels: [
        'Red',
        'Blue',
        'Yellow'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
};*/

const config = {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
    },
};

const chart = new Chart(my_canva, config);