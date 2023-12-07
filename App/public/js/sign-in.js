jQuery(document).ready(function () {
    let image;

    $("#icons").on("click", ".usr-icon", function(){
        console.log("clicked on "+ $(this).attr("value"));
        const value = $(this).attr("value");

        image = value;
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