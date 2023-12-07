jQuery(document).ready(function () {
    let image;
    let prv;

    $("#icons").on("click", ".usr-icon", function(){
        console.log("clicked on "+ $(this).attr("value"));
        const value = $(this).attr("value");

        //here I wanna set the clicked icon's bf to green
        $(this).css("background-color", "green");

        if (prv != null) {
            // Set the previous clicked icon's background color to white
            $("#icons .usr-icon[value='" + prv + "']").css("background-color", "#FFFFFF");
        }

        image = value;
        prv = value;
    });

    $("#form").submit(function(e){
        e.preventDefault();

        const username = $('#usrfield').val();
        const password = $('#pwdfield').val();

        const new_usr = {
            username,
            password,
            image
        }

        $.get("/log", new_usr, function(data){
            console.log("submitting from sign-in.js -> get with "+new_usr);
            window.location.href = "/log";
        });
    });
});