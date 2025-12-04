// Slick
$(document).ready(function() {
    $("#tabs").tabs();

    $('.hero-slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 3000
    });
});