var my_canva = document.getElementById('myChart');

const data_div = document.querySelector('.trip-name');
const trip = JSON.parse(data_div.dataset.expenses);

const all_colors = ["#FF6348", "#ECCC68", "#1E90FF", "#7BED9F", "#57606F", "#FFA502", "#70A1FF", "#57606F", "#FF6B81"];

const expenses = trip[1];

//initializing all chart variables
var categories = [];
var values = [];
var colors = []

//must set all variable values
for(var i=0; i<expenses.length; i++){
    const expense = expenses[i];
    categories.push(expense[0]);

    const expcat = expense[1];
    var value = 0;
    for(var j=0; j<expcat.length; j++){
        const exp = expcat[j];
        value += parseInt(exp[2]);
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

const config = {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
    },
};

const travel_chart = new Chart(my_canva, config);

my_canva.onclick = function(e){
    var slice = travel_chart.getElementsAtEventForMode(e, 'nearest', {intersect: true}, true);
    if (!slice.length) return; // return if not clicked on slice
    var category = travel_chart.data.labels[slice[0].index];
    console.log("clicked on category: "+category);

    window.location.href = '/specific-category?category=' + encodeURIComponent(category);
};