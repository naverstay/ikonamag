var mainSlider, articleIsotop, s, isotopeWidth;

$(function ($) {

    articleIsotop = $('#grid');
    isotopeWidth = $('.isotopeWidth');

    $('.bsImage').each(function (ind) {
        var firedEl = $(this);
        firedEl.closest('.slide').css('background-image', 'url(' + firedEl.attr('src') + ')');
    });

    mainSlider = $('.mainSlider').slick({
        arrows: false,
        dots: true,
        fade: true,
        speed: 1000
    });


    //projectSlider = $('.projectSlider').slick({
    //    arrows: false,
    //    dots: false,
    //    infinite: false,
    //    variableWidth: true,
    //    touchThreshold: 50,
    //    speed: 300
    //});


});

function initArticleIsotop(callback) {

    articleIsotop.one('arrangeComplete', function () {
        articleIsotop.addClass('loaded');
    });

    articleIsotop.isotope({
        //layoutMode: 'masonryHorizontal',
        //layoutMode: 'masonry',
        transitionDuration: 0,
        //layoutMode: 'fitRows',
        fitRows: {
            gutter: 0
        },
        masonry: {
            //isFitWidth: true,
            gutter: 0,
            //columnWidth: '.grid_sizer'
        },
        itemSelector: '.box',
        percentPosition: true
    });

    if (typeof callback == 'function') {
        callback();
    }

    articleIsotop.on('layoutComplete', function (event, laidOutItems) {
      
    });
}

function initSkrollr() {
    setTimeout(function () {
        s = skrollr.init({
            forceHeight: false
        });
    }, 20);
}

function fitIsotopContainer() {
    var w = isotopeWidth.width();

    articleIsotop.css('width', Math.min(w, (420 * (Math.floor(w / 420) || 1))));
    
    setTimeout(function () {
        articleIsotop.isotope('layout');
    }, 20);

}

$(window).on('load', function () {

    var maxH = 0;

    $('.projectSlider .slide').each(function (ind) {
        maxH = Math.max(maxH, $(this).height());
    });

    $('.projectSlider').css('height', maxH);

    $('.scrollerContainer').each(function (ind) {
        initPortfolioScroller(this);
    });

    fitIsotopContainer();

    initArticleIsotop(function () {
        initSkrollr();
    });

}).on("orientationchange", function (event) {
    fitIsotopContainer();
    initSkrollr();
}).on("resize", function (event) {
    fitIsotopContainer();
    initSkrollr();
});
