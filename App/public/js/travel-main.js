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

    /*fetch('/specific-category',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify({ category: category }),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Redirect to the specific category page
        window.location.href = '/specific-category';
    }).catch(error => {
        console.error('Fetching went wrong:', error);
    });*/
    window.location.href = '/specific-category?category=' + encodeURIComponent(category);
};