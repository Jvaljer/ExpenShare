var canva = document.getElementById('category-chart');

const data_div = document.querySelector('.container');
const infos = JSON.parse(data_div.dataset.category);

const trip_members = infos[3];
const all_colors = ["#ECCC68", "#FFA502", "#F94C10","#FF7F50", "#FF6348", "#FF6B81", "#FF4757", "#B31312"];

//initializing all chart variables
var members = [];
var values = [];
var colors = []

//must set the values for variables

//here we wanna set the datas used by the chart
const data = {
    labels: members,
    datasets: [{
        label: 'Trip Members',
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