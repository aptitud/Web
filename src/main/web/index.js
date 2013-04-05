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
});