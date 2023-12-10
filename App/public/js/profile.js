let roles = [];

jQuery(document).ready(function () {
    $("#back-btn").on("click", function(e){
        console.log("clicked on the button");
        e.preventDefault();
        window.location.href = "/logged?roles=" + encodeURIComponent(JSON.stringify(roles));
    });
});

function ChooseRole(item, id) {
    document.getElementById('dropdown'+id).innerText = item;
    Hide('dropdown'+id);

    //here we wanna set the trip's role to item
    const tname = document.getElementById("trip"+id).textContent;
    console.log("setting role "+item+" for trip "+tname);

    if(roles.includes(tname)){
        roles[roles.indexOf(tname)+1] = item;
    } else {
        roles.push(tname);
        roles.push(item);
    }
    console.log("updated roles are: "+roles);
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