jQuery(document).ready(function () {
    // Track added members and categories
    const addedMembers = [];
    const addedCategories = [];

    let mcpt = 0;
    let ccpt = 0;
    // Function to add a member to the list
    function addMember() {
        const memberName = "member "+mcpt;
        if (memberName) {
            console.log("Adding a member");
            $("#user-list").append(`<div class="usr">${memberName}</div>`);
            addedMembers.push(memberName);
        }
        mcpt++;
    }

    // Function to add a category to the list
    function addCategory() {
        const categoryName = "category "+ccpt;
        if (categoryName) {
            console.log("Adding a category");
            $("#category-list").append(`<div class="category">${categoryName}</div>`);
            addedCategories.push(categoryName);
        }
        ccpt++;
    }

    // Handle "Add Member" button click
    $("#add-user-btn").on("click", function () {
        console.log("clicked on add-user");
        addMember();
    });

    // Handle "Add Category" button click
    $("#add-category-btn").on("click", function () {
        console.log("clicked on add-category");
        addCategory();
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

        // Gather all members and categories
        const formData = {
            name: travelName,
            start: startDate,
            end: endDate,
            budget: budget,
            image: image,
            comment: comment,
            members: addedMembers,
            categories: addedCategories
        };

        $.post("/validate-trip", formData, function (data) {
            window.location.href = "/validate-trip";
        });
    });
});