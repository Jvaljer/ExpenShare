let del_trip;

jQuery(document).ready(function () {
    $(".dlt-btn").on("click", function(e){
        console.log("delete button was hit");
        e.preventDefault();
        window.location.href = "/logged?trip=" + encodeURIComponent(del_trip);
    });
});

function DeleteTrip(trip_name){
    console.log("wanna delete "+trip_name);
    del_trip = trip_name;
}