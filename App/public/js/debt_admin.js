

function who(personIndex) {
    window.location.href = '/debt-admin?personIndex='+encodeURIComponent(personIndex);
}

function remove(index, personIndex) {
    let last_char = window.location.href[window.location.href.length - 1]
    let number = ['0','1','2','3','4','5','6','7','8','9'];
    if (last_char == '?'){
        window.location.href = '/debt-admin?index=' + encodeURIComponent(index);
    } else if (last_char == 'g'){
        window.location.href = window.location.href + '&index=' + encodeURIComponent(index);
    } else if (number.includes(last_char)){
        window.location.href = window.location.href.substring(0, window.location.href.length - 1) + encodeURIComponent(index);
    }
   
}