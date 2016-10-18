var $body_var, $header, $doc, $browserWindow, goTopBottomMarker, goTopBtn, goTopBtnHolder,
    autoCompleteOptions = {
        url: "autocomplete.json",

        getValue: "name",

        cssClasses: "autocomplete_v1",

        template: {
            type: "custom",
            method: function (value, item) {

                if (item.icon != void 0) {
                    return "<div  class='eac_img'><img src='" + item.icon + "' /></div> <div class='eac_text clr_black'> <div class='gl_link'><span>" + item.name + "</span></div></div> ";
                } else {
                    return "<div class='eac_text clr_black'> <div class='gl_link'><span>" + item.name + "</span></div></div> ";
                }

            }
        },

        list: {
            match: {
                enabled: true
            },
            showAnimation: {
                type: "slide"
            },
            hideAnimation: {
                type: "slide"
            }
        }
    };

$(function ($) {

    $body_var = $('body');
    $browserWindow = $(window);
    $header = $('.header');
    goTopBottomMarker = $('.goTopBottomMarker').eq(0);
    goTopBtnHolder = $('.goTopBtnHolder');
    goTopBtn = $('.goTopBtn');
    $doc = $(document);

    var headerSearchInput = $('#header_search');

    $('.searchOpenBtn').on ('click', function () {
        $body_var.addClass('search_open');
        headerSearchInput.focus();
        return false;
    });

    $('.searchCloseBtn').on ('click', function () {
        $body_var.removeClass('search_open');
        headerSearchInput.blur();
    });

    $('.asideLeftToggle').on ('click', function () {
        $body_var.toggleClass('aside_left_open');
    });
    
    $('.playBtn').on ('click', function () {
        $body_var.toggleClass('is_playing');
    });

    goTopBtn.on ('click', function () {
        $("html, body").stop().animate({scrollTop: 0}, 800);
        return false;
    });

    $('.autoComplete').easyAutocomplete(autoCompleteOptions);

    //all_dialog_close();

});

$(window).on('scroll', function () {

    goTopBtnHolder.css('padding-top', goTopBottomMarker.offset().top - goTopBtn.outerHeight() - goTopBtn.css('margin-bottom').replace('px', '') * 1);

    $body_var.toggleClass('show_go_top', $doc.scrollTop() > $browserWindow.height()).toggleClass('rel_go_top', $doc.scrollTop() + $browserWindow.height() >= goTopBottomMarker.offset().top);

});

function all_dialog_close() {
    $body_var.on('click', '.ui-widget-overlay', all_dialog_close_gl);
}

function all_dialog_close_gl() {
    $(".ui-dialog-content").each(function () {
        var $this = $(this);
        if (!$this.parent().hasClass('always_open')) {
            $this.dialog("close");
        }
    });
}