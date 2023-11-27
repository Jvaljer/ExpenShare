var my_canva = document.getElementById('myChart');
console.log("fetched my canva");

const chart = new Chart(my_canva, {
   type: "bar",
   data: {
       labels: ["C1", "C2", "C3"],
       datasets: [{
           data: [240, 120, 140, 130]
       }]
   }
});
console.log("created my chart");