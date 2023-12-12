function ShowHidePassword(){
    var field = document.getElementById("pwdfield");
    var btn = document.getElementById("show-hide");

    if(field.type === "password"){
        field.type = "text";
        btn.textContent = "hide";
    } else if(field.type === "text"){
        field.type = "password";
        btn.textContent = "show";
    }
}