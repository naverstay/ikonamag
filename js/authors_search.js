$(function ($) {


});


function initAuthorsIsotop() {

    articleIsotop = $('#grid');

    articleIsotop.one('arrangeComplete', function () {
        articleIsotop.addClass('loaded');
    });

    articleIsotop.isotope({
        //layoutMode: 'masonry',
        transitionDuration: 0,
        layoutMode: 'fitRows',
        fitRows: {
            gutter: 0
        },
        masonry: {
            gutter: 0
        },
        itemSelector: '.box',
        percentPosition: true
    });

}

$(window).on('load', function () {


    initAuthorsIsotop();


});