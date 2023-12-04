function who(personIndex) {
    // Use AJAX to send the personIndex to the server
    fetch('/debt-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personIndex: personIndex }),
    })
    .then(response => response.json())
}

