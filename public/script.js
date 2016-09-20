function getSuggestions(input) {
    var request = new XMLHttpRequest();

    request.open('GET', '/suggestions/suggest/' + input, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);

            console.log(data.docsuggest[0].options);

            return(data.docsuggest[0].options);
        }

    };

    request.send();
}

function addEventListeners() {
    var searchNode = document.getElementById("search");

    searchNode.addEventListener("keydown", function(event){
        getSuggestions(searchNode.value);

    });
}

addEventListeners();
