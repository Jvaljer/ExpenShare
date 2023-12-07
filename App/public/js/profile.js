function ChooseRole(item, id) {
    document.getElementById('dropdown'+id).innerText = item;
    Hide();
}

function Toggle(dropdownId) {
    // Toggle the visibility of the dropdown content
    var dropdownContent = document.querySelector('#' + dropdownId + ' + .dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

function Hide(dropdownId) {
    // Hide the dropdown content
    document.querySelector('#' + dropdownId + ' + .dropdown-content').style.display = 'none';
}