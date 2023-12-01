jQuery(document).ready(function () {
    // Track added members and categories
    const members = [];
    const categories = [];

    let mcpt = 0;
    let ccpt = 0;
    // Function to add a member to the list
    function AddMember() {
        const member = "member "+mcpt;
        if (member) {
            console.log("Adding a member");
            $("#user-list").append(`<div class="usr">${mcpt}</div>`);
            members.push(member);
        }
        mcpt++;
    }

    // Function to add a category to the list
    function AddCategory() {
        const category = "category "+ccpt;
        if (category) {
            console.log("Adding a category");
            $("#category-list").append(`<div class="category">${ccpt}</div>`);
            categories.push(category);
        }
        ccpt++;
    }

    // Handle "Add Member" button click
    $(".notadded-usr").on("click", function(){
        console.log("clicked on an available user");
    });

    // Handle "Add Category" button click
    $("#add-category-btn").on("click", function () {
        console.log("clicked on add-category");
        AddCategory();
    });

    // Handle form submission
    $("#form").submit(function (e) {
        e.preventDefault();
        // Get other form data
        const travelName = $("#travel-input").val();
        const startDate = $("#travel-start-date").val();
        const endDate = $("#travel-end-date").val();
        const budget = $("#budget-slider").val();
        const image = $("#group-img-chooser").val();
        const comment = $("#comment-text").val();
        const color = $("#color-picker").val();

        // Gather all members and categories
        const trip_data = {
            name: travelName,
            start: startDate,
            end: endDate,
            budget: budget,
            image: image,
            comment: comment,
            members: members,
            categories: categories,
            color: color
        };

        //julopipo said 'try using AJAX' -> tf that is ...
        $.post("/validate-trip", trip_data, function (data) {
            window.location.href = "/validate-trip";
        });
    });
});