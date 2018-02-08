$.ajax({
    dataType: "json",
    url: "http://localhost:3000/",
    async: false,
    success: function (data) {
        generateHtml(data);
    }
});

function generateHtml(response) {
    for (var key in response) {
        console.log(key);
        $('.page-content').append("<h2 class=\"category\">" + key + "</h2 >");
        $('.page-content').append("<div class=\"images\">");
        var value = response[key];
        value.forEach(element => {
            $('.page-content').append("<img src=" + element.imageUri + " class=\"each-image\">");
        });
        $('.page-content').append("</div>");
        console.log(response[key]);
    }
}

