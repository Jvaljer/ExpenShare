jQuery(document).ready(function () {
    $("#back-btn").on("click", function(e){
        console.log("clicked on the button duh");
        e.preventDefault();
        window.location.href = "/logged";
    })
});

function ChooseRole(item, id) {
    document.getElementById('dropdown'+id).innerText = item;
    Hide();
}

function Toggle(id) {
    // Toggle the visibility of the dropdown content
    var dropdown = document.querySelector('#' + id + ' + .dropdown-content');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

function Hide(id) {
    // Hide the dropdown content
    document.querySelector('#' + id + ' + .dropdown-content').style.display = 'none';
}