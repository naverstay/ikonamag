/**
 * @author Anton Shein & Artem Polikarpov
 */

var TOUCHFlag = ('ontouchstart' in document);

function ClassConsole(sId) {
    this.dBody = document.getElementById(sId);
    this.dBody.style.border = "1px solid red";
    this.log = function (sMessage) {
        this.dBody.innerHTML = sMessage;
    }
}


function registerEventHandler(dObject, sEventName, fHandler) {
    if (dObject.attachEvent)
        dObject.attachEvent('on' + sEventName, fHandler);
    else if (dObject.addEventListener)
        dObject.addEventListener(sEventName, fHandler, true);
}

//registerEventHandler(window, 'load', slideToEnd);

function slideToEnd() {
    var percent = (1 - scroller_controller.iRollerWidth / scroller_controller.iWindowWidth) * 100;
    scroller_controller.startMoveToPercent(percent);
    //scroller_controller.startSlideToPercent(90);
    //if (!////////console.log) //console = new Class//console('info');
}

var scroller_window = scroller_controller = null;
// Костыль для связи нативной анимации с джейТвинером
var STRIPE = null;


function initPortfolioScroller(id) {
    //debugger;
    
    scroller_window = new ClassScrollerWindow(id);
    scroller_window.moveToPercent(0);
    STRIPE = $(id || '#scroller_window').find('.scrollerStripe')[0];


    $('.scrollerController', scroller_window).show();
    scroller_controller = new ClassScrollerController('.scrollerController', scroller_window);

    var temp_arr = scroller_window.dWindow.getElementsByTagName('div');
    var info_divs = [];
    for (var i in temp_arr) {
        if (temp_arr[i].className == 'item') {
            var img = temp_arr[i].getElementsByTagName('img')[0];
            if (!img) img = jQuery('.img-item', jQuery(temp_arr[i])).get(0);

            img.onmouseover = highliteLink;
            img.onmouseout = dischargeLink;
        }
        if (/item_info/i.test(temp_arr[i].className)) {
            var str = temp_arr[i].innerHTML;
            var class_name = /class/.test(str) ? str.match(/class:(.*?);/)[1] : 't_sites';
            var company = /company/.test(str) ? str.match(/company:(.*?);/)[1] : 'Упячка!';
            var left = temp_arr[i].parentNode.parentNode.offsetLeft / scroller_window.iStripeWidth * 100;
            var span = document.createElement('span');
            if (class_name != 't_empty') span.innerHTML = '<i><div class="scroller-mark"></div>' + company + '</i>';
            else span.innerHTML = '<i>' + company + '</i>'
            span.className = class_name;
            span.style.left = left + '%';
            scroller_controller.dWindow.appendChild(span);
            ////////////console.log(temp_arr[i].parentNode.offsetParent.offsetLeft , left);
        }
    }

    jQuery('.payup-img').each(function () {
        this.onmouseover = highliteLink;
        this.onmouseout = dischargeLink;
    });


    scroller_controller.analizeContent();
    registerEventHandler(window, 'resize', redrawPortfolio);
    //slideToEnd();
    flinging(id);
    jQuery(id).fadeTo(1).css('visibility', 'visible').fadeIn();

}

function ClassScrollerWindow(sId) {
    var oThis = this;
    this.dWindow = $(sId).find('.scrollerWindow')[0];
    //this.dWindow.style.visibility = "hidden";
    this.dWindow.style.position = 'relative';
    this.dWindow.style.overflow = 'hidden';
    this.dStripe = this.dWindow.firstChild;
    while (this.dStripe.nodeType != 1) this.dStripe = this.dStripe.nextSibling;
    this.dStripe.style.position = 'absolute';
    this.iWindowWidth = this.dWindow.offsetWidth;
    this.iStripeWidth = this.dStripe.offsetWidth;


    this.tMoveTimer = null;
    this.iPercent = null;
    this.iToPercent = null;


    this.redraw = function (iControllPercent) {
        this.iWindowWidth = this.dWindow.offsetWidth;
        this.iStripeWidth = this.dStripe.offsetWidth;
        if (iControllPercent) this.iPercent = iControllPercent;
        else return;
        this.startSlideToPercent(this.iPercent);
        ////////////console.log(this.iWindowWidth + ' - ' +this.iPercent);
    }

    this.moveToPercent = function (iPercent) {
        this.iPercent = iPercent;
        this.dStripe.style.left = -Math.ceil(this.iStripeWidth * iPercent / 100) + 'px';
    }
    this.slideToPercent = function () {
        var flag = 0;
        if (Math.abs(this.iPercent - this.iToPercent) < 0.5 || (flag = this.iPercent * this.iStripeWidth / 100 + this.iWindowWidth >= this.iStripeWidth)) {
            if (this.tMoveTimer) {
                clearInterval(this.tMoveTimer);
                this.tMoveTimer = null;
                if (flag) this.iPercent = (this.iStripeWidth - this.iWindowWidth - 1) / this.iStripeWidth * 100;
                //this.moveToPercent(this.iToPercent);
            }

        }
        else {
            var distance = this.iPercent - this.iToPercent;
            var dirrection = distance / Math.abs(distance);
            var increase = 0.05 * Math.pow(Math.abs(distance), 1.5);
            //////////console.log(increase, this.iToPercent);
            //if (increase < 0.5) increase = 0.5;
            this.moveToPercent(this.iPercent - increase * dirrection);
            //scroller_controller.moveToPercent(this.iPercent);
        }
        ////////console.log(this.iPercent*this.iStripeWidth/100 + this.iWindowWidth, this.iStripeWidth+10);
    }

    this.startSlideToPercent = function (iPercent) {
        jTweener.removeTween();
        if (!this.tMoveTimer) this.tMoveTimer = setInterval(function () {
            oThis.slideToPercent();
        }, 50);
        this.iToPercent = iPercent;
        //////////console.log(iPercent);
    }

}

function ClassScrollerController(sId, oUke) {
    var oThis = this;
    this.oScroller = oUke;
    this.dWindow = $(sId, $(oUke.dWindow).parent())[0];
    disableSelection(jQuery(this.dWindow));
    //this.dWindow.style.visibility = "hidden";
    this.dWindow.style.position = 'relative';
    //jQuery(this.dWindow).css({})
    this.dRoller = this.dWindow.firstChild;
    while (this.dRoller.nodeType != 1) this.dRoller = this.dRoller.nextSibling;
    this.dRoller.style.position = 'absolute';
    this.dContrStripe = $('.contrStripe', $(oUke.dWindow).parent())[0]; // Полоса, закрывающая собой серую полосу на плашке скроллера. Очень грубо.
    this.dContrStripe.style.display = 'block';
    this.iLeftWindowOffset = this.dWindow.offsetLeft;
    this.iCatchLeftOffset = 0;
    this.iWindowWidth = this.dWindow.offsetWidth;
    this.iRollerWidth = this.dRoller.offsetWidth;
    this.iRollerWidth = Math.ceil(this.iWindowWidth * this.oScroller.iWindowWidth / this.oScroller.iStripeWidth);
    this.dContrStripe.style.width = this.iRollerWidth /*+ 60*/ + 'px';
    this.dContrStripe.style.position = 'absolute';
    this.dContrStripe.style.height = '50px';
    if (TOUCHFlag) {
        this.dContrStripe.style.zIndex = '51';
    }
    this.dRoller.style.width = this.iRollerWidth + 'px';

    this.tMoveTimer = null;
    this.iPercent = null;
    this.iToPercent = null;
    this.iTruePercent = null;

    this.redraw = function () {
        //console.log(this);
        this.iWindowWidth = this.dWindow.offsetWidth;
        this.iRollerWidth = this.dRoller.offsetWidth;
        this.iRollerWidth = Math.ceil(this.iWindowWidth * this.oScroller.iWindowWidth / this.oScroller.iStripeWidth);
        this.dContrStripe.style.width = this.iRollerWidth /*+ 60*/ + 'px';
        this.dRoller.style.width = this.iRollerWidth + 'px';
        this.iPercentWidth = this.iRollerWidth / this.iWindowWidth * 100;
        this.iPercent = this.iEndPercent - this.iPercentWidth;
        this.moveToPosition(this.iPercent);
        this.iPercent = this.dRoller.offsetLeft / this.iWindowWidth * 100;
    }

    var rollerLeftStart, rollerTopStart;
    var checkedRollerDirectionFlag = false;
    var movableRollerFlag = false;
    if (!TOUCHFlag) {
        this.dRoller.onmousedown = function (event) {
            oThis.catchRoller(event);
        }
    } else {
        ////////console.log('addEventListener touchstart oThis.catchRoller');
        this.dContrStripe.addEventListener('touchstart', function (event) {
            oThis.catchRoller(event);
        }, false);
        //jQuery(this.dContrStripe).css('border', '1px solid red');
    }
    ////////////console.log('this.iCatchLeftOffset');
    this.catchRoller = function (event) {
        //////console.log('this.catchRoller');
        jTweener.removeTween(); // Удаление анимации с инерцией
        if (!event) event = window.event;
        if (!TOUCHFlag) {
            rollerLeftStart = event.clientX;
        } else {
            rollerLeftStart = event.targetTouches[0].clientX;
            rollerTopStart = event.targetTouches[0].clientY;
        }
        this.iCatchLeftOffset = rollerLeftStart - this.dRoller.offsetLeft - this.iLeftWindowOffset;
        var body = document.getElementsByTagName('body')[0];
        if (!TOUCHFlag) {
            body.onmousemove = function (event) {
                oThis.moveRoller(event);
            }
            body.onmouseup = function () {
                oThis.dropRoller();
            }
        } else if (TOUCHFlag && event.targetTouches.length == 1) {
            ////////console.log('addEventListener touchmove touchend');
            this.dContrStripe.addEventListener('touchmove', oThis.moveRoller, false);
            this.dContrStripe.addEventListener('touchmove', oThis.dropRoller, false);
        } else if (TOUCHFlag && event.targetTouches.length > 1) {
            return false;
        }

        if (event.preventDefault) event.preventDefault();
        else event.returnValue = false;
        if (this.oScroller.tMoveTimer) this.oScroller.tMoveTimer = clearTimeout(this.oScroller.tMoveTimer);
        ////////////console.log('!');
    }

    this.moveRoller = function (event) {
        var rollerLeftNow, rollerTopNow;
        if (!event) event = window.event;

        if (!TOUCHFlag) {
            rollerLeftNow = event.clientX;
        } else {
            rollerLeftNow = event.targetTouches[0].clientX;
            rollerTopNow = event.targetTouches[0].clientY;
        }

        function act() {
            if (oThis.tMoveTimer) {
                oThis.tMoveTimer = clearTimeout(oThis.tMoveTimer);
                oThis.oScroller.tMoveTimer = clearTimeout(oThis.oScroller.tMoveTimer);
            }
            var iLeft = rollerLeftNow - oThis.iLeftWindowOffset - oThis.iCatchLeftOffset;
            if (iLeft < 0) iLeft = 0;
            if (iLeft + oThis.iRollerWidth > oThis.iWindowWidth) iLeft = oThis.iWindowWidth - oThis.iRollerWidth;
            oThis.iPercent = iLeft / oThis.iWindowWidth * 100;
            oThis.dContrStripe.style.left = iLeft + 30 + 'px';
            oThis.dRoller.style.left = iLeft + 'px';
            oThis.oScroller.moveToPercent(oThis.iPercent);
            oThis.iEndPercent = (oThis.dRoller.offsetLeft + oThis.iRollerWidth) / oThis.iWindowWidth * 100;
        }

        ////////////console.log(this.iPercent);
        if (!TOUCHFlag) {
            act();
        } else if (TOUCHFlag && event.targetTouches.length == 1) {
            if (!checkedRollerDirectionFlag) {
                if (Math.abs(rollerLeftNow - rollerLeftStart) - Math.abs(rollerTopNow - rollerTopStart) >= -5) {
                    movableRollerFlag = true;
                    event.preventDefault();
                }
                checkedRollerDirectionFlag = true;
            } else if (movableRollerFlag) {
                act();
            }
        }
    }

    this.dropRoller = function () {
        var body = document.getElementsByTagName('body')[0];
        if (!TOUCHFlag) {
            body.onmousemove = null;
            body.onmouseup = null;
        } else {
            this.dContrStripe.removeEventListener('touchmove', oThis.moveRoller, false);
            this.dContrStripe.removeEventListener('touchend', oThis.dropRoller, false);
        }

        movableRollerFlag = false;
        checkedRollerDirectionFlag = false;
    }

    this.moveToPosition = function (iPercent) {
        //jTweener.removeTween();
        this.iPercent = iPercent;
        var iLeft = Math.ceil(this.iWindowWidth * iPercent / 100);
        if (iLeft < 0) {
            iLeft = 0;
            this.iPercent = 0;
        }
        if (iLeft + this.iRollerWidth > this.iWindowWidth) {
            iLeft = this.iWindowWidth - this.iRollerWidth;
            this.iPercent = iLeft / this.iWindowWidth * 100;
        }
        this.dContrStripe.style.left = iLeft + 30 + 'px';
        this.dRoller.style.left = iLeft + 'px';
        this.iEndPercent = (this.dRoller.offsetLeft + this.iRollerWidth) / this.iWindowWidth * 100;
        this.oScroller.moveToPercent(this.iPercent);
//		////////console.log(this.iEndPercent);
    }


    this.moveToPercent = function (iPercent) {
        console.log(this);
        this.iPercent = iPercent;
        var iLeft = Math.ceil(this.iWindowWidth * iPercent / 100);
        if (iLeft < 0) {
            iLeft = 0;
            this.iPercent = this.iToPercent;
            if (this.tMoveTimer) this.tMoveTimer = clearTimeout(this.tMoveTimer);
            this.iPercent = 0;
        }
        if (iLeft + this.iRollerWidth > this.iWindowWidth) {
            this.iPercent = this.iToPercent;
            iLeft = this.iWindowWidth - this.iRollerWidth;
            if (this.tMoveTimer) this.tMoveTimer = clearTimeout(this.tMoveTimer);
            this.iPercent = iLeft / this.iWindowWidth * 100;
        }
        
        this.dContrStripe.style.left = iLeft + 30 + 'px';
        this.dRoller.style.left = iLeft + 'px';
        this.iEndPercent = (this.dRoller.offsetLeft + this.iRollerWidth) / this.iWindowWidth * 100;
//		////////console.log(this.iEndPercent);
    }
    this.slideToPercent = function () {
        if (Math.abs(this.iPercent - this.iToPercent) < 0.5) {
            if (this.tMoveTimer) {
                clearInterval(this.tMoveTimer);
                this.tMoveTimer = null;
                //this.moveToPercent(this.iToPercent);
                this.iEndPercent = (this.dRoller.offsetLeft + this.iRollerWidth) / this.iWindowWidth * 100;
                //////////console.log(this.iEndPercent);
            }

        }
        else {
            var distance = this.iPercent - this.iToPercent;
            var dirrection = distance / Math.abs(distance);
            var increase = 0.05 * Math.pow(Math.abs(distance), 1.5);
            ////////////console.log(distance, increase*dirrection);
            //if (increase < 0.5) increase = 0.5;
            var iPercent = this.iPercent - increase * dirrection;
            ////////////console.log(iPercent);
            this.moveToPercent(iPercent);
            this.oScroller.startSlideToPercent(iPercent);
            this.iEndPercent = (this.dRoller.offsetLeft + this.iRollerWidth) / this.iWindowWidth * 100;
        }
    }

    this.preventDefault = function (event) {
        console.log(event);
        if (!event) event = window.event;
        if (event.preventDefault) event.preventDefault();
        else event.returnValue = false;
    }

    this.stopPropagation = function (event) {
        if (!event) event = window.event;
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
    }

    this.dWindow.onmousedown = function (event) {
        if (TOUCHFlag || event.which < 2) {
            oThis.preventDefault(event)
        }
    }

    this.startSlideToPercent = function (iPercent) {
        jTweener.removeTween();
        redrawPortfolio();
        if (!this.tMoveTimer) this.tMoveTimer = setInterval(function () {
            oThis.slideToPercent();
        }, 50);
        this.iToPercent = iPercent;
        ////////////console.log(iPercent, this.iPercent, this.iToPercent, this.iTruePercent);
    }

    this.startMoveToPercent = function (iPercent) {
        jTweener.removeTween();
        oThis.iToPercent = iPercent + 1;
        oThis.iPercent = iPercent;
        oThis.moveToPercent(iPercent);
        oThis.redraw();
        scroller_window.dWindow.style.visibility = 'visible';
        scroller_controller.dWindow.style.visibility = 'visible';

//		oThis.slideToPercent();
        ////////////console.log(iPercent, this.iPercent, this.iToPercent, this.iTruePercent);
    }


    this.analizeContent = function () {
        var elements = this.dWindow.getElementsByTagName('span');
        var memory_w = 0, start_i = 0;
        for (var i in elements) {
            var width = false;
            try {
                width = parseFloat(elements[i].style.left) - parseFloat(elements[i - 2 + 1].style.left);
            } catch (err) {
            }
            if (/<i>&nbs/.test(elements[i].innerHTML)) {
                if (!start_i) start_i = i;
                if (width) memory_w += width;
                elements[i].style.display = 'none';
                continue;
            }
            if (width) {
                elements[start_i].style.width = memory_w + width + '%';
                elements[i].style.width = '3%';
            }
            memory_w = 0;
            start_i = i;
            elements[i].onclick = function (event) {
                oThis.getClick(event)
            };
        }
    }

    this.getClick = function (event) {
        if (!event) event = window.event;
        if (!event.target) event.target = event.srcElement;
        var target = event.target;
        while (!/span/i.test(target.nodeName)) target = target.parentNode;
        var left = target.offsetLeft;
        var percent = left / this.iWindowWidth * 100;
        this.startSlideToPercent(percent - 1);
        this.stopPropagation(event);
        ////////console.log(this.iWindowWidth, percent);
    }
}


function highliteLink(event) {
    if (!event) event = window.event;
    if (!event.target) event.target = event.srcElement;
    //		////////////console.log('!');
    //console.log(event.target);
    if (event.target.className == "inner-line" || event.target.className == "payup-img") {
        var target = event.target.parentNode;
    }
    else {
        var target = event.target;
    }

    target = target.parentNode.parentNode.getElementsByTagName('a')[1];
    //alert(target.nodeName);
    target.style.color = "#bb3300";
    target.style.borderBottomColor = 'rgba(187, 51, 0, 0.2)';
}

function dischargeLink(event) {
    if (!event) event = window.event;
    if (!event.target) event.target = event.srcElement;

    if (event.target.className == "inner-line" || event.target.className == "payup-img") {
        var target = event.target.parentNode;
    }
    else {
        var target = event.target;
    }

    target = target.parentNode.parentNode.getElementsByTagName('a')[1];

    //var target = event.target.parentNode.parentNode.getElementsByTagName('a')[1];
    target.style.color = "";
    target.style.borderBottomColor = '';
}

function redrawPortfolio() {
    scroller_window.redraw(scroller_controller.iTruePercent);
    scroller_controller.redraw();
    scroller_window.redraw(scroller_controller.iEndPercent - scroller_controller.iPercentWidth);
}

/* Швыряние работ с инерцией */
function flinging(id) {

    //jQuery(document).mouseup(function(event) {
    //scroller_controller.dropRoller();
    //stripeMouseUp(event);
    //});

    var scroller_window_ap = jQuery(".scrollerWindow", $(id));
    //var scroller_stripe_wraper = jQuery("#scroller_stripe_wraper");
    //var STRIPE = STRIPE;
    var $scroller_stripe = jQuery(STRIPE);
    var start_left, stop_left, min_left, time_tick, left_tick;

    var item_caption = jQuery(".project_item", $scroller_stripe);

    /*scroller_stripe.css({
     "cursor": "url(i/grab.cur)"
     });*/

    function preventClick(event) {
        event.preventDefault();
    }

    $scroller_stripe.find('a').on("click", preventClick);
    //$scroller_stripe.find('.project_item').children(':not(.item_caption)').find('a').on("click", preventClick);

    var $document = jQuery(document);
    var mouseLeftStart, mouseTopStart;
    var checkedDirectionFlag = false;
    var movableFlag = false;
    var prevMouseUpTime = 0;
    var prevDirection;

    function stripeMouseDown(event) {
        if (TOUCHFlag || event.which < 2) {
            function act() {
                ////////console.log('stripeMouseDown act');
                start_left = $scroller_stripe.position().left;
                //min_left = - (scroller_stripe.width() - scroller_window_ap.width());
                min_left = -($scroller_stripe.innerWidth() - scroller_window_ap.width());
                time_tick = [];
                left_tick = [];
                jTweener.removeTween();
                scroller_controller.tMoveTimer = clearTimeout(scroller_controller.tMoveTimer);
                scroller_controller.oScroller.tMoveTimer = clearTimeout(scroller_controller.oScroller.tMoveTimer);

                var iPercent = start_left / scroller_window.iStripeWidth * (-1) * 100;
                ////////console.log(iPercent);
                scroller_controller.moveToPercent(iPercent);
            }


            var target = jQuery(event.target);

            if (target.is('.item_caption') || target.parents('.item_caption').length) {
                if (!TOUCHFlag) {
                    $document.unbind("mousemove");
                } else {
                    STRIPE.removeEventListener('touchmove', stripeMouseMove, false);
                }
            } else {
                $scroller_stripe.addClass("grabbing");
                if (!TOUCHFlag) {
                    mouseLeftStart = event.pageX;
                    event.preventDefault();
                    act();
                    $document.mousemove(stripeMouseMove);
                    $document.mouseup(stripeMouseUp);
                } else if (TOUCHFlag && event.targetTouches.length == 1) {
                    mouseLeftStart = event.targetTouches[0].pageX;
                    mouseTopStart = event.targetTouches[0].pageY;
                    act();
                    ////////console.log('addEventListener touchmove touchend');
                    STRIPE.addEventListener('touchmove', stripeMouseMove, false);
                    STRIPE.addEventListener('touchend', stripeMouseUp, false);
                } else if (TOUCHFlag && event.targetTouches.length > 1) {
                    return false;
                }
            }
        }
    }

    function stripeMouseMove(event) {


        var mouseLeftNow, mouseTopNow;

        function act() {
            event.preventDefault();
            var different = mouseLeftNow - mouseLeftStart;

            var now_left = start_left + different;

            /* Сопротивление */
            if (now_left < min_left) {
                now_left = Math.round(now_left + ((min_left - now_left) / 1.25));
            }
            /* Сопротивление */
            if (now_left > 0) {
                now_left = Math.round(now_left - (now_left / 1.25));
            }

            $scroller_stripe.css({"left": now_left});

            time_tick.push(event.timeStamp);
            left_tick.push(now_left);

            var iPercent = now_left / scroller_window.iStripeWidth * (-1) * 100;
            ////////console.log(iPercent);
            scroller_controller.moveToPercent(iPercent);
            /**/
        }

        if (!TOUCHFlag) {
            mouseLeftNow = event.pageX;
            act();
        } else if (TOUCHFlag && event.targetTouches.length == 1) {
            mouseLeftNow = event.targetTouches[0].pageX;
            mouseTopNow = event.targetTouches[0].pageY;

            if (!checkedDirectionFlag) {
                if (Math.abs(mouseLeftNow - mouseLeftStart) - Math.abs(mouseTopNow - mouseTopStart) >= -5) {
                    movableFlag = true;
                    event.preventDefault();
                }
                checkedDirectionFlag = true;
            } else if (movableFlag) {
                act();
            }
        }
    }

    function stripeMouseUp(event) {
        if (!TOUCHFlag || !event.targetTouches.length) {

            if (!TOUCHFlag) {
                $document.unbind('mouseup');
                $document.unbind('mousemove');
            } else {
                STRIPE.removeEventListener('touchmove', stripeMouseMove, false);
                STRIPE.removeEventListener('touchend', stripeMouseUp, false);
            }
            stop_left = $scroller_stripe.position().left;
            var timeStamp = event.timeStamp;
            var upTimeDiff = timeStamp - prevMouseUpTime;
            var direction = start_left - stop_left >= 0;


            ////console.log(upTimeDiff, direction, prevDirection);

            var target = jQuery(event.target);
            var href = target.attr('href');
            if (!href) href = target.parents('a').attr('href');

            $scroller_stripe.removeClass("grabbing");


            /*Если двинули слишком влево*/
            if (stop_left < min_left) {
                jTweener.removeTween();
                jTweener.addTween($scroller_stripe, {left: min_left, time: 1, transition: "easeoutexpo"});
            }

            /*Или слишком вправо*/
            else if (stop_left > 0) {
                jTweener.removeTween();
                jTweener.addTween($scroller_stripe, {left: 0, time: 1, transition: "easeoutexpo"});
            }
            /*Если всё в допустимиых пределах*/
            else {
                /*Позиция одно мгновение назад*/
                var before_stop_time = timeStamp - 100;
                var diff_time, min_diff_time, diff_take;
                if (!time_tick) return;
                for (i = 0; i < time_tick.length; i++) {
                    diff_time = Math.abs(before_stop_time - time_tick[i]);
                    //diff_take = 0;
                    if (i == 0) {
                        min_diff_time = diff_time;
                    }
                    if (diff_time <= min_diff_time) {
                        diff_take = i;
                        min_diff_time = diff_time;
                    }
                }


                ////////console.log(Math.abs(start_left - stop_left), min_diff_time);
                if (Math.abs(start_left - stop_left) > 3) {
                    var flinging_left = left_tick[diff_take];

                    /*На сколько сдвинули (если сдвинули) за последнее мгновение. Оцениваем размах*/
                    if (Math.abs(time_tick[time_tick.length - 1] - timeStamp) <= 100 && flinging_left && flinging_left != stop_left) {
                        var flinging_power = stop_left - flinging_left;
                        var doubleBoost = upTimeDiff <= 1000 && direction == prevDirection ? upTimeDiff / 1000 : 0;
                        var diff = flinging_power * 2 + flinging_power * doubleBoost;
                        var new_left = stop_left + diff;
                        var time = 1;
                        if (new_left < min_left) {
                            time = Math.abs(time / ((diff) / (Math.abs(diff) - Math.abs(new_left - min_left))));
                            new_left = min_left;
                        }
                        if (new_left > 0) {
                            time = Math.abs(time / ((diff) / (Math.abs(diff) - Math.abs(new_left))));
                            new_left = 0;
                        }

                        //console.log(time);


                        /*Время — чем дальше, тем дольше*/
                        //var time = Math.abs(stop_left - new_left) / (100 + (Math.abs(stop_left - new_left) * 0.05));

                        jTweener.removeTween();
                        jTweener.addTween($scroller_stripe, {
                            onUpdate: redrawScrollerOnAnimation,
                            left: new_left,
                            time: time,
                            transition: "easeoutexpo"
                        });
                    }
                } else if (href && !checkedDirectionFlag) {
                    ////////console.log(href);
                    document.location = href;
                }
            }
            movableFlag = false;
            checkedDirectionFlag = false;

            prevDirection = direction;
            prevMouseUpTime = timeStamp;
        }
    }

    if (!TOUCHFlag) {
        $scroller_stripe.mousedown(stripeMouseDown);
    } else {
        ////////console.log('addEventListener touchstart');
        STRIPE.addEventListener('touchstart', stripeMouseDown, false);
    }

    var mw_min_left, mw_left, mw_timer_ctrl, mw_timer;
    $scroller_stripe.mousewheel(function (event, delta, deltaX, deltaY) {
        //console.log(deltaX, deltaY);
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            event.preventDefault();
            clearTimeout(mw_timer);
            if (!mw_timer_ctrl) {
                jTweener.removeTween();
                scroller_controller.tMoveTimer = clearTimeout(scroller_controller.tMoveTimer);
                scroller_controller.oScroller.tMoveTimer = clearTimeout(scroller_controller.oScroller.tMoveTimer);
                mw_min_left = -($scroller_stripe.innerWidth() - scroller_window_ap.width());
                //mw_left = STRIPE.offsetLeft;
                mw_timer_ctrl = true;
            }

            mw_timer = setTimeout(function () {
                mw_timer_ctrl = false;
            }, 100);

            var left = STRIPE.offsetLeft - Math.round(deltaX * 25);

            if (left < mw_min_left) left = mw_min_left;
            if (left > 0) left = 0;
            $scroller_stripe.css({left: left});
            var iPercent = left / scroller_window.iStripeWidth * (-1) * 100;

            ////console.log(iPercent);
            scroller_controller.moveToPercent(iPercent);

            return false;
        }
    });

}


function redrawScrollerOnAnimation() {
    var iPercent = STRIPE.offsetLeft / scroller_window.iStripeWidth * (-1) * 100;
    scroller_controller.moveToPercent(iPercent);
    /**/
}

function disableSelection(target) {
    target
        .mousemove(function (e) {
            e.preventDefault();
        })
        .mousedown(function (e) {
            e.preventDefault();
        });
}