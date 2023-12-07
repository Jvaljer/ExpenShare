jQuery(document).ready(function () {
    // Track added members and categories
    let members = [];
    let categories = [];
    // Function to add a member to the list
    function AddMember(member) {
        members.push(member);
    }
    function RemoveMember(member){
        if(members.includes(member)){
            members.splice(members.indexOf(member), 1);
        }
    }

    // Function to add a category to the list
    function AddCategory(category) {
        categories.push(category);
    }
    function RemoveCategory(category){
        if(categories.includes(category)){
            categories.splice(categories.indexOf(category), 1);
        }
    }

    // Handle "Add Member" button click
    $("#available-users").on("click", ".notadded-usr", function(){
        // Get the image source
        const value = $(this).attr("value");
        const img_src = $(this).find(".user-icon").attr("src");

        // Create the 'added-user' div and append it to the '#added-users' container
        $("#added-users").append(`
        <div class="added-usr" value="${value}">
            <img class="user-icon" src="${img_src}">
            <div class="popup">${value}</div>
        </div>`);

        AddMember(value);
        $(this).remove();
    });
    $("#added-users").on("click", ".added-usr", function(){
        // Get the image source
        const value = $(this).attr("value");
        const img_src = $(this).find(".user-icon").attr("src");

        // Create the 'added-user' div and append it to the '#added-users' container
        $("#available-users").append(`
        <div class="notadded-usr" value="${value}">
            <img class="user-icon" src="${img_src}">
            <div class="popup">${value}</div>
        </div>`);

        RemoveMember(value);
        $(this).remove();
    });

    $("#available-categories").on("click", ".notadded-cat", function(){
        console.log("clicked on: " + $(this).attr("value"));

        // Get the image source
        const value = $(this).attr("value");
        const img_src = $(this).find(".cat-icon").attr("src");

        // Create the 'added-user' div and append it to the '#added-users' container
        $("#added-categories").append(`
        <div class="added-cat" value="${value}">
            <img class="cat-icon" src="${img_src}">
            <div class="popup">${value}</div>
        </div>`);

        AddCategory(value);
        $(this).remove();
    });
    $("#added-categories").on("click", ".added-cat", function(){
        console.log("clicked on: " + $(this).attr("value"));

        // Get the image source
        const value = $(this).attr("value");
        const img_src = $(this).find(".cat-icon").attr("src");

        // Create the 'added-user' div and append it to the '#added-users' container
        $("#available-categories").append(`
        <div class="notadded-cat" value="${value}">
            <img class="cat-icon" src="${img_src}">
            <div class="popup">${value}</div>
        </div>`);

        // Remove the clicked 'notadded-usr' div
        RemoveCategory(value);
        $(this).remove();
    });

    // Handle form submission
    $("#form").submit(function (e) {
        e.preventDefault();
        // Get other form data
        const travelName = $("#travel-input").val();
        const startDate = $("#travel-start-date").val();
        const endDate = $("#travel-end-date").val();
        const budget = $("#budget-slider").val();
        const comment = $("#comment-text").val();
        const color = $("#color-picker").val();

        // Gather all members and categories
        const trip_data = {
            name: travelName,
            start: startDate,
            end: endDate,
            budget: budget,
            comment: comment,
            members: members,
            categories: categories,
            color: color
        };
        $.post("/validate-trip", trip_data, function (data) {
            window.location.href = "/validate-trip";
        });
    });
});