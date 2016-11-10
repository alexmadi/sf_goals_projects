firstStart = true;
(function($){

    $.fn.Am_player = function(options) {
        
        var settings = {
           sprites_count : 0,
           sprite_step : 0,
        }; 

        return this.each(function() {
            // start inner code

            var videoId = $(this).attr('id'),
                videoWrapClass = videoId + '_wrapper';

            $(this).wrap("<div class='mediaplayer mediaplayer_normal_size mediaplayer_stopped'></div>");
            $(this).parent('.mediaplayer').wrap("<div class='player'></div>");

            $(this).closest('.player').addClass(videoWrapClass);

            $(this).closest('.player').append(
                '<div class="control_panel">' +
                    '<div class="play_btn active_pause">'+
                        '<button class="play"></button> ' +
                        '<button class="pause"></button> ' +
                    '</div>' +
                    '<div class="time_slider">' +
                        '<input class="time-slider" id="time-slider" type="range" disabled value="0" step="any" "/>' +
                        '<div class="screen_tooltip"></div>'+
                    '</div>' +

                    '<div class="time_wrap">' +
                        '<span class="current-time">00:00</span>' +
                        '<span class="duration"></span>' +
                    '</div>' +
                    '<div class="mute_btn">' +
                        '<input class="muted" type="checkbox" />' +
                        '<div class="ic_volume on ">' +
                         '<span class="ic_volume_arc_1"></span>'+
                         '<span class="ic_volume_arc_2"></span>' +
                         '<span class="ic_volume_arc_3"></span>'+ 
                         '<div class="ic_volume_rect"></div>'+
                        '</div>'+
                    '</div>' +
                    '<div class="volume_slider">'+
                        '<input class="volume-slider" id="volume-slider" type="range" value="1" max="1" step="0.01" />' +
                    '</div>' +

                    '<div class="full_screen_btn">' +
                        '<input type="button" class="full_screen_input">' +
                    '</div>' +
                '</div>' 
            );

            ///  end wrapping

            if (window.webshim) {
                (function () {
                    webshim.setOptions('mediaelement', {
                        replaceUI: 'auto'
                    });
                    webshim.setOptions({types: 'range'});
                    webshim.setOptions('extendNative', true);
                    webshim.polyfill('mediaelement forms forms-ext');
                })();
            }

            //add some controls
            jQuery(function ($) {
                $('div.player').each(function () {
                    var player = this;
                    var getSetCurrentTime = createGetSetHandler(

                    function () {
                        $('input.time-slider', player).prop('value', $.prop(this, 'currentTime'));
                    }, function () {
                        try {
                            $('video, audio', player).prop('currentTime', $.prop(this, 'value'));
                        } catch (er) {}
                    });
                    var getSetVolume = createGetSetHandler(

                    function () {
                        $('input.volume-slider', player).prop('value', $.prop(this, 'volume'));

                    }, function () {
                        $('video, audio', player).prop('volume', $.prop(this, 'value'));
                    });
                    $('video, audio', this).bind('durationchange updateMediaState', function () {
                        var duration = $.prop(this, 'duration');

                        if (!duration) {
                            return;
                        }
                    
                        $('input.time-slider', player).prop({
                            'max': duration,
                            disabled: false
                        });

                        var duration_time_parsed = parseInt(duration, 10); 
                        duration_time_final = SecondsTohhmmss(duration_time_parsed);
                        $('span.duration', player).text(duration_time_final);

                    }).bind('progress updateMediaState', function () {
                        var buffered = $.prop(this, 'buffered');
                        if (!buffered || !buffered.length) {
                            return;
                        }
                        buffered = getActiveTimeRange(buffered, $.prop(this, 'currentTime'));
                        $('span.progress', player).text(buffered[2]);
                    }).bind('timeupdate', function () {   
                        var curr_time = $.prop(this, 'currentTime')
                        var curr_time_parsed = parseInt(curr_time, 10); 
                        curr_time_final = SecondsTohhmmss(curr_time_parsed);
                        $('span.current-time', player).text(curr_time_final);

                    }).bind('timeupdate', getSetCurrentTime.get).bind('emptied', function () {
                        $('input.time-slider', player).prop('disabled', true);
                        $('span.duration', player).text('--');
                        $('span.current-time', player).text(0);
                        $('span.network-state', player).text(0);
                        $('span.ready-state', player).text(0);
                        $('span.paused-state', player).text($.prop(this, 'paused'));
                        $('span.height-width', player).text('-/-');
                        $('span.progress', player).text('0');
                    }).bind('waiting playing loadedmetadata updateMediaState', function () {
                        $('span.network-state', player).text($.prop(this, 'networkState'));
                        $('span.ready-state', player).text($.prop(this, 'readyState'));
                    }).bind('play pause', function () {
                        $('span.paused-state', player).text($.prop(this, 'paused'));
                    }).bind('volumechange', function () {
                        var muted = $.prop(this, 'muted');
                        $('span.muted-state', player).text(muted);
                        $('input.muted', player).prop('checked', muted);
                        $('span.volume', player).text($.prop(this, 'volume'));
                    }).bind('volumechange', getSetVolume.get).bind('play pause', function () {
                        $('span.paused-state', player).text($.prop(this, 'paused'));
                    }).bind('loadedmetadata updateMediaState', function () {
                        $('span.height-width', player).text($.prop(this, 'videoWidth') + '/' + $.prop(this, 'videoHeight'));
                    }).each(function () {
                        if ($.prop(this, 'readyState') > $.prop(this, 'HAVE_NOTHING')) {
                            $(this).triggerHandler('updateMediaState');
                        }
                    });

                    $('input.time-slider', player).bind('input', getSetCurrentTime.set).prop('value', 0);
                    $('input.volume-slider', player).bind('input', getSetVolume.set);

                    $('button.play', player).bind('click', function () {

                        $(this).parent().removeClass('active_pause');
                        $(this).parent().addClass('active_play');

                        $('video, audio', player)[0].play();

                        $(this).closest('.mediaplayer').removeClass('mediaplayer_paused mediaplayer_stopped');
                        $(this).closest('.mediaplayer').addClass('mediaplayer_playing');

                        if ($.browser.mozilla) {
                            $(this).removeClass('active');
                            $('.pause').addClass('active');
                        }
                    });
                    $('button.pause', player).bind('click', function () {
                        $(this).parent().removeClass('active_play');
                        $(this).parent().addClass('active_pause');

                        $('video, audio', player)[0].pause();
                        $(this).closest('.mediaplayer').removeClass('mediaplayer_playing');
                        $(this).closest('.mediaplayer').addClass('mediaplayer_paused');

                         if ($.browser.mozilla) {
                            $(this).removeClass('active');
                            $('play').addClass('active');
                        }
                    });

                    $videoWrapper.click(function() {
                       if ($.browser.mozilla) {
                            $("video").click();

                            if (($('mediaplayer').hasClass('mediaplayer_paused')) && ($('mediaplayer').hasClass('mediaplayer_stopped'))) {
                                 $('.play').addClass('active');
                            }
                       }

                        if ($(this).hasClass('mediaplayer_paused')) {
                            $(this).addClass('mediaplayer_playing').removeClass('mediaplayer_paused  mediaplayer_stopped');
                            
                            $(this).closest('.player').find('.play_btn').removeClass('active_pause');
                            $(this).closest('.player').find('.play_btn').addClass('active_play');
                            $(this).find('video, audio', player)[0].play();


                            if ($.browser.mozilla) {
                                $('.pause').removeClass('active'); 
                                $('.play').addClass('active');
                                $('.play_btn').removeClass('active_play active_pause');
                            }

                        } else if ($(this).hasClass('mediaplayer_stopped')) {
                            $(this).find('video, audio', player)[0].play();
                            $(this).removeClass('mediaplayer_stopped');
                            $(this).addClass('mediaplayer_playing');
                            
                            $(this).closest('.player').find('.play_btn').removeClass('active_pause');
                            $(this).closest('.player').find('.play_btn').addClass('active_play');
                
                            if ($.browser.mozilla) {

                                $('.mediaplayer').removeClass('mediaplayer_paused');
                                $('.mediaplayer').addClass('mediaplayer_playing');
                                $('.play_btn').addClass('active_play');
                                $('.pause').addClass('active');
                            }
                        } else {
                            $(this).addClass('mediaplayer_paused').removeClass('mediaplayer_playing');
                            $(this).closest('.player').find('.play_btn').removeClass('active_play');
                            $(this).closest('.player').find('.play_btn').addClass('active_pause');
                            $(this).find('video, audio', player)[0].pause();

                            if ($.browser.mozilla) {
                                $('.mediaplayer').removeClass('mediaplayer_paused');
                                $('.mediaplayer').addClass('mediaplayer_playing'); 
                                $('.play').removeClass('active');
                                $('.pause').addClass('active');
                                $('video, audio', player)[0].pause();
                            }
                        }
                    });

                    $('.full_screen_input').click(function() {
                        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                        if (document.documentElement.requestFullScreen) {
                            document.documentElement.requestFullScreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullScreen) {
                            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                    } else {
                        if (document.cancelFullScreen) {
                            document.cancelFullScreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        }
                    }
                    });

                    $videoWrapper.dblclick(function() {
                        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                        if (document.documentElement.requestFullScreen) {
                            document.documentElement.requestFullScreen();
                        } else if (document.documentElement.mozRequestFullScreen) {
                            document.documentElement.mozRequestFullScreen();
                        } else if (document.documentElement.webkitRequestFullScreen) {
                            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                        }
                        } else {
                            if (document.cancelFullScreen) {
                                document.cancelFullScreen();
                            } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if (document.webkitCancelFullScreen) {
                                document.webkitCancelFullScreen();
                            }
                        }
                    });

                    $('.volume-slider').change(function () {
                        val = $(this).val();
                        $volumeIcon = $(this).closest('.control_panel').find('.ic_volume');

                        if ((val < 0.66) && (val !== 0)) {
                            $volumeIcon.addClass('v_66');
                        } else if (val >= 0.66) {
                            $volumeIcon.removeClass('v_66');
                        } 
                        if ((val < 0.33) && (val !== 0)) {
                            $volumeIcon.addClass('v_33');
                        } else if (val >= 0.33) {
                            $volumeIcon.removeClass('v_33');
                        } 
                        if (val == 0) {
                            $volumeIcon.removeClass('on v_33 v_66 ').addClass('mute');
                        } 
                        if ((val > 0) && ($volumeIcon.hasClass('mute'))) {
                            $volumeIcon.removeClass('mute').addClass('on');
                        }
                    });

                    if($.browser.chrome){
                        $(window).keypress(function (e) {
                            if (e.keyCode === 0 || e.keyCode === 32) {
                                e.preventDefault();

                                 if (($('.mediaplayer').hasClass('mediaplayer_paused')) || ($('.mediaplayer').hasClass('mediaplayer_stopped'))) {
                                    $('video, audio', player)[0].play(); 
                                    $('.mediaplayer').removeClass('mediaplayer_stopped mediaplayer_paused');
                                    $('.mediaplayer').addClass('mediaplayer_playing');
                                    $('.play_btn').removeClass('active_pause');
                                    $('.play_btn').addClass('active_play');
                                    $('.control_panel').fadeOut(6000);

                                } else if ($('.mediaplayer').hasClass('mediaplayer_playing')) {
                                    $('video, audio', player)[0].pause();
                                    $('.mediaplayer').removeClass('mediaplayer_playing');
                                    $('.mediaplayer').addClass('mediaplayer_paused');
                                    $('.control_panel').show(0);
                                }
                            }
                        })
                    }

                    $(document).keyup(function(e) {
                        if (e.keyCode === 27) {
                            if ($playerContainer.hasClass('full_screen_on')) {
                                $playerContainer.removeClass('full_screen_on');
                            }
                        }
                    });

                    $('input.muted', player).bind('click updatemuted', function () {
                        $('video, audio', player).prop('muted', $.prop(this, 'checked'));
                    }).triggerHandler('updatemuted');


                    $('input.controls', player).bind('click', function () {
                        $('video, audio', player).prop('controls', $.prop(this, 'checked'));
                    }).prop('checked', true);

                    $('select.load-media', player).bind('change', function () {
                        var srces = $('option:selected', this).data('src');
                        if (srces) {
                            //the following code can be also replaced by the following line
                            //$('video, audio', player).loadMediaSrc(srces).play();
                            $('video, audio', player).removeAttr('src').find('source').remove().end().each(function () {
                                var mediaElement = this;
                                if (typeof srces == 'string') {
                                    srces = [srces];
                                }
                                $.each(srces, function (i, src) {

                                    if (typeof src == 'string') {
                                        src = {
                                            src: src
                                        };
                                    }
                                    $(document.createElement('source')).attr(src).appendTo(mediaElement);
                                });
                            })[0].load();
                            $('video, audio', player)[0].play();
                        }
                    }).prop('selectedIndex', 0);
                });
            });

            //helper for createing throttled get/set functions (good to create time/volume-slider, which are used as getter and setter)

            function createGetSetHandler(get, set) {
                var throttleTimer;
                var blockedTimer;
                var blocked;
                return {
                    get: function () {
                        if (blocked) {
                            return;
                        }
                        return get.apply(this, arguments);
                    },
                    set: function () {
                        clearTimeout(throttleTimer);
                        clearTimeout(blockedTimer);

                        var that = this;
                        var args = arguments;
                        blocked = true;
                        throttleTimer = setTimeout(function () {
                            set.apply(that, args);
                            blockedTimer = setTimeout(function () {
                                blocked = false;
                            }, 30);
                        }, 0);
                    }
                };
            };

            function getActiveTimeRange(range, time) {
                var len = range.length;
                var index = -1;
                var start = 0;
                var end = 0;
                for (var i = 0; i < len; i++) {
                    if (time >= (start = range.start(i)) && time <= (end = range.end(i))) {
                        index = i;
                        break;
                    }
                }
                return [index, start, end];
            };

            // MINE CODE

            $(document).ready(function() {

                $(".ic_volume" ).click(function() {
                  $(this).toggleClass( "on mute" );
                });

                $('.muted').change(function() { 
                    var $check = $(this),
                        $div = $check.parent();
                    if ($check.prop('checked')) {
                        $(this).next().addClass('mute').removeClass('on');
                        
                        $volumeSlider = $(this).closest('.control_panel').find('.volume-slider')
                        var currentVolumeValue = $volumeSlider.val();

                       $volumeSlider.val(0);
                       $volumeSlider.attr("value",0);
                       $volumeSlider.attr("max",0);
                      

                    } else { 
                        $( this ).next().addClass('on').removeClass('mute');
                        $volumeSlider.val(currentVolumeValue);
                        $volumeSlider.attr("value",currentVolumeValue);
                        $volumeSlider.attr("max",1);
                    }
                });

                if (firstStart) {
                    $('.mediaplayer').dblclick(function(e) {
                        if ($(this).hasClass('mediaplayer_full')) {
                            $(this).addClass('mediaplayer_normal_size').removeClass('mediaplayer_full');
                            $(this).parent().removeClass('full_screen_on');
                            $(this).parent().find('.full_screen_btn').removeClass('full_screen_on');
                        }
                        else {
                           $(this).addClass('mediaplayer_full').removeClass('mediaplayer_normal_size');
                           $(this).parent().addClass('full_screen_on');
                           $(this).parent().find('.full_screen_btn').addClass('full_screen_on');
                        }
                    });

                    firstStart = false;
                }

                $playerContainer.find('.full_screen_input').click(function() {
                    $playerContainer.toggleClass('full_screen_on');
                    $videoWrapper.toggleClass('mediaplayer_normal_size mediaplayer_full');
                    $playerContainer.find('.full_screen_btn').toggleClass('full_screen_on');
                });

                var timeSlideWidth = $('.time-slider').width(),
                    sprites_count = settings.sprites_count,
                    spriteStep = settings.sprite_step,
                    currentSpriteStep = 1,
                    partForOneImage = timeSlideWidth/sprites_count;

                $playerContainer.find('.time-slider').on('mousemove', function (e) {

                   $playerContainer.find('.screen_tooltip').css('display','block');

                    currentOffsetLeft = e.pageX;

                    var offset = $playerContainer.find( '.time-slider' ).offset().left,
                        timeSliderPositionLeft = $playerContainer.find('.time-slider').offset().left,
                        mousePosition = currentOffsetLeft - timeSliderPositionLeft,
                        tooltipWidth = $('.screen_tooltip').width(),
                        fixedTooltipPosition = ((offset + tooltipWidth / 2) * - 1);

                    $playerContainer.find('.screen_tooltip').css({
                        'left' : currentOffsetLeft,
                        'margin-left': fixedTooltipPosition
                    });

                    var currentFrame = Math.floor(mousePosition/partForOneImage)+1;

                    currentSpriteStep = spriteStep*(currentFrame-1);

                    $playerContainer.find('.screen_tooltip').css({
                        "background-position-y" : -currentSpriteStep
                    });
                });

                $playerContainer.find(".time-slider").mouseleave(function() {
                    $(".screen_tooltip").hide();
                });

                $playerContainer.find(".time-slider").mouseenter(function() {
                    $(".screen_tooltip").show();
                });

            });  // end docready

            var SecondsTohhmmss = function(totalSeconds) {
                var hours   = Math.floor(totalSeconds / 3600),
                    minutes = Math.floor((totalSeconds - (hours * 3600)) / 60),
                    seconds = totalSeconds - (hours * 3600) - (minutes * 60);
                // round seconds
                seconds = Math.round(seconds * 100) / 100

                if (hours == 0) {
                    var result = (minutes < 10 ? "0" + minutes : minutes);
                    result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
                    return result;
                }

                if (hours > 0) {
                    var result = (hours < 10 ? "0" + hours : hours);
                    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
                    result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
                    return result;
                }
            }

            var timeDelay = 1;

            function delayCheck() {
                if(timeDelay == 5) {

                    if ($videoWrapper.hasClass('mediaplayer_playing')) {
                        $playerContainer.find('.control_panel').fadeOut();
                    }

                    timeDelay = 1;
                }

                timeDelay = timeDelay + 1;
            }

            $(document).mousemove(function() {
                $playerContainer.find('.control_panel').show(0);
                timeDelay = 1;
                clearInterval(initDelay);
                initDelay = setInterval(delayCheck, 600);
            });

            // page loads starts delay timer 
            initDelay = setInterval(delayCheck, 600);

            // end inner code

            $videoPlayer = $(this);
            $videoWrapper = $videoPlayer.parent(); // mediaplayer
            $playerContainer = $(this).closest('.player');

            if (options) {
               $.extend(settings, options);
            }
        });
    };
})(jQuery);


/*
usage

1.add class="am_player" to outer container
2.call Am_player

$('.slider_1').Am_player({

}); 

*/

$(document).ready(function() {
    addMediaClasses();
    
    $(window).resize(function() {
        addMediaClasses();
    });
    
    function addMediaClasses() {
        var playerWidth = $('.player').width();
     
        $('.player').removeClass('break_one').removeClass('break_two').removeClass('break_three');
        
        if (playerWidth > 1650) {
            $('.player').addClass('break_full');
        }
        if (playerWidth <= 1650 && playerWidth > 1030) {
            $('.player').addClass('break_one');
        }
        else if (playerWidth <= 1030 && playerWidth > 768) {
            $('.player').addClass('break_two');
        }
        else if (playerWidth <= 768) {
            $('.player').addClass('break_three');
        }
    }
});