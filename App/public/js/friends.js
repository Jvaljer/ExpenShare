let role;

jQuery(document).ready(function () {
    //must find how & when to update the roles
    $(".selector").on("click", function(){
        console.log("clicked on the selector eh");
    });
});

function ChooseRole(item, id) {
    document.getElementById('dropdown'+id).innerText = item;
    Hide('dropdown'+id);
    role = item;
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