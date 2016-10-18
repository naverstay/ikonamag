$(function ($) {

    $('.filterToggleBtn').on ('click', function () {
        $(this).toggleClass('opened');

        $('.filterForm').slideToggle();

        return false;
    });

    $('.select2').select2({
        minimumResultsForSearch: Infinity,
        width: '107px',
        containerCssClass: "select_c2",
        adaptDropdownCssClass: function (c) {
            return 'select_d2';
        }
    });

    var periodSlider = $('.filterPeriod');

    noUiSlider.create(periodSlider[0], {
        step: 1,
        start: [2008, 2012],
        tooltips: true,
        range: {
            'min': 2006,
            'max': 2016
        },
        connect: true,
        format: {
            to: function (value) {
                return value;
            },
            from: function (value) {
                return value;
            }
        }
    });

});


function initAuthorsIsotop() {

    articleIsotop = $('#grid');

    articleIsotop.one('arrangeComplete', function () {
        articleIsotop.addClass('loaded');
    });

    articleIsotop.isotope({
        //layoutMode: 'masonry',
        transitionDuration: 0,
        //layoutMode: 'fitRows',
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