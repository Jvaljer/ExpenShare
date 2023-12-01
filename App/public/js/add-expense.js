jQuery(document).ready(function () {
    // Handle form submission
    $("#form").submit(function (e) {
        e.preventDefault();
        // Get other form data
        const name = $("#expense-name").val();
        const amount = $("#expense-amount").val();
        const date = $("#expense-date").val();
        const category = $("input[name='category']:checked").val();
        const comment = $("#comment").val();

        // Gather all members and categories
        const expense_data = {
            name: name,
            date: date,
            category: category,
            amount: amount,
            comment: comment,
        };

        //julopipo said 'try using AJAX' -> tf that is ...
        $.post("/valid-expense", expense_data, function (data) {
            window.location.href = "/valid-expense";
        });
    });
});