function ShowHidePassword(){
    var field = document.getElementById("pwd-field");
    var btn = document.getElementById("show-hide");

    if(field.type === "password"){
        field.type = "text";
        btn.textContent = "hide";
    } else if(field.type === "text"){
        field.type = "password";
        btn.textContent = "show";
    }
}