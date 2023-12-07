function ChooseRole(item, id) {
    // Set the selected item text and close the dropdown
    document.getElementById('dropdown'+id).innerText = item;
    Hide();
}

function Toggle() {
    // Toggle the visibility of the dropdown content
    var dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

function Hide() {
    // Hide the dropdown content
    document.querySelector('.dropdown-content').style.display = 'none';
}