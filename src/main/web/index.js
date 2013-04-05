function updateLayout() {
    document.getElementById("startPage").setAttribute("height", window.innerHeight + 1);
    document.getElementById("philosophyPage").setAttribute("height", window.innerHeight + 1);
    document.getElementById("aptitudDayPage").setAttribute("height", window.innerHeight + 1);
    document.getElementById("fellowPage").setAttribute("height", window.innerHeight + 1);
    document.getElementById("bloggPage").setAttribute("height", window.innerHeight + 1);
}

jQuery(document).ready(function ($) {
    $(".scroll").click(function (event) {
        event.preventDefault();
        $('html,body').animate({scrollTop: $(this.hash).offset().top}, 1000);
    });

    requirejs.config({
        baseUrl: "javascript"
    });

    require(["navigator"], function(navigator) {
        var aliases = {};

        $("[data-alias]").each(function(index, element) {
            aliases[$(element).attr("data-alias")] = function() {
                $(element).click();
            }
        });

        navigator.subscribe(function(location) {
            var callback = aliases[location];

            if (callback) {
                callback();
            }
        });
    });

    $.getJSON("http://aptitud-sthlm.tumblr.com/api/read/json?num=1&callback=?", function(result) {
        $("#bloggPage").html(result.posts[0]["regular-body"]);
    });
});