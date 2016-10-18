var postSlider, postThumbSlider, interestSlider, progressVal;

$(function ($) {

    progressVal = $('.progressVal');

    postSlider = $('.postSlider').slick({
        arrows: true,
        dots: true,
        speed: 500,
        touchThreshold: 50,
        asNavFor: '.postThumbSlider'
    });

    postThumbSlider = $('.postThumbSlider').slick({
        arrows: false,
        dots: false,
        variableWidth: true,
        infinite: true,
        speed: 500,
        touchThreshold: 50,
        asNavFor: '.postSlider'
    });

    interestSlider = $('.interestSlider').slick({
        arrows: true,
        dots: false,
        //variableWidth: true,
        infinite: true,
        speed: 500,
        width: 180,
        touchThreshold: 50,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 840,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: 'unslick'
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

    //initAjaxNav();

});

$(window).on('load', function () {

    var maxH = 0;

    $('.projectSlider .slide').each(function (ind) {
        maxH = Math.max(maxH, $(this).height());
    });

    $('.projectSlider').css('height', maxH);

    $('.scrollerContainer').each(function (ind) {
        initPortfolioScroller(this);
    });

    showArticleProgress();

    $('.fancyboxLink').on ('click', function (e) {
   
    }).fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        padding: 0,
        closeBtn: true,
        helpers: {
            title: {
                type: 'inside'
            },
            overlay: {
                locked: false
            }
        }
    });
    

}).on('scroll', function () {

    showArticleProgress();

}).on('popstate', function () {
    $.ajax({
        url: location.pathname + '?ajax=1',
        success: function (data) {
            $('#content').html(data);
        }
    });
});

function showArticleProgress() {
    var headerSpacer = 60, winHeight = $browserWindow.height(), win_bottom = $doc.scrollTop() + $browserWindow.height();

    var element = document.elementFromPoint(($browserWindow.width() / 2).toFixed(), (winHeight / 2).toFixed());

    var article = $(element).closest('.postContainer');

    if (article.length > 0) {
        var artHeight = article.height(), artScroll = $doc.scrollTop() - article.offset().top;

        var progress = Math.min(100, Math.max(0, (artScroll) / (artHeight - winHeight)) * 100);

        //console.log(article, article.offset().top, artHeight, $doc.scrollTop(), progress);

        progressVal.css('width', progress + '%');

    }
}

function initAjaxNav () {
    $('a.ajaxLink').click(function () {
        var url = $(this).attr('href');

        $.ajax({
            url: url + '?ajax=1',
            success: function (data) {
                $('#content').html(data);
            }
        });

        if (url != window.location) {
            window.history.pushState(null, null, url);
        }

        return false;
    });
}

function isHhistoryApiAvailable() {
    return !!(window.history && history.pushState);
}