jQuery(document).ready(function () {
    let image;
    let prv;

    $("#icons").on("click", ".usr-icon", function(){
        const value = $(this).attr("value");

        //here I wanna set the clicked icon's background to green
        $(this).css("background-color", "green");

        if (prv != null) {
            // Set the previous clicked icon's background color to white
            $("#icons .usr-icon[value='" + prv + "']").css("background-color", "#FFFFFF");
        }

        image = value;
        prv = value;
    });

    $("#btn").on("click",function(e){
        e.preventDefault();
        const username = $('#usrfield').val();
        const password = $('#pwdfield').val();

        window.location.href = "/log?name="+encodeURIComponent(username)+"&pwd="+encodeURIComponent(password)+"&img="+encodeURIComponent(image);
    })
});