//LAURENE'S VERSION
/*jQuery(document).ready(function () {
    ///////////////////////////////
    function get_name_from_icon(users_list, icon){

        let name = "";
        for(i=0; i<users_list.length; i++){
            if (users_list[i][2] == icon){
                name = users_list[i][0];
            }
        }
        return name;
    }

    function get_list_friends(users_list, current_user, current_trip){
    
        const person_icon = []; 
        for(i=0; i<users_list.length; i++){
            let test = users_list[i][1];
            if (test.includes(current_trip) && users_list[i][0] != current_user){
                person_icon.push(users_list[i][2]);
            }
        }
        return person_icon;
    }

    $('.other-user').on('click', 'button', function() {
        // Retrieve information about the clicked button
        const imgSrc = $(this).find('.img').attr('id');
        console.log('Button clicked with image source:', imgSrc);
        
        let name = get_name_from_icon(users_list, imgSrc);
        let friends = get_list_friends(users_list, name, current_trip);

        $("#imgSrc").replace(`
        <img class="img" id="${img_src}" src="media/<%=people[i]%>">`);
    });
    //////////////////////////////////////////////

    // Handle form submission
    $("#form").submit(function (e) {
        e.preventDefault();

        // Gather all members and categories
        const debt_data = {
            people: friends
        };

        //julopipo said 'try using AJAX' -> tf that is ...
        $.post("/debt-admin", trip_data, function (data) {
            window.location.href = "/debt-admin";
        });
    });
}); */


/*jQuery(document).ready(function () {
    // Handle form submission
    $("#form").submit(function (e) {
        e.preventDefault();
        
        $('.other-user').on('click', 'button', function() {
            // Retrieve information about the clicked button
            var imgSrc = $(this).find('.img').attr('src');
        });

        $.ajax({
            url: '/debt-admin',
            method: 'POST',
            data: JSON.stringify({person : imgSrc}),
            success: function(res) {
                $("curren-user").html('person: ${res.response}')
            }
        });
        
    });
}); */


function who(personIndex) {
    // Use AJAX to send the personIndex to the server
    fetch('/debt-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personIndex: personIndex }),
    })
    .then(response => response.text())
}

/*
$(document).ready(function() {
    // Use event delegation to handle click events on buttons within the form
    $('.other-user').on('click', 'button', function() {
        // Retrieve information about the clicked button
        var imgSrc = $(this).find('.img').attr('src');
        console.log('Button clicked with image source:', imgSrc);
    });


    $.ajax({
        url: '/debt-admin',
        method: 'POST',
        data: { imgSrc: imgSrc },
        success: function(response) {
            console.log("response " + response.json());
            return data;
        }
    });

});*/